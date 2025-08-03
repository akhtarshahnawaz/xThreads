// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./IOTypes.sol";
import "./BaseEscrowFactory.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "./AddressConverter.sol";

contract EscrowFactory is BaseEscrowFactory{
    using IOTypes for *;
    using AddressConverter for address;
    using AddressConverter for bytes32;


    mapping(bytes32 => IOTypes.Order) public orders;
    mapping(bytes32 => IOTypes.SourceEscrow[]) public sourceEscrows;
    mapping(bytes32 => IOTypes.DestinationEscrow[]) public destinationEscrows;


    constructor(address _owner, uint256 _privateTime, uint256 _publicTime, uint256 _expiryTime, uint256 _securityDeposit) 
        BaseEscrowFactory(_owner, _privateTime, _publicTime, _expiryTime, _securityDeposit){}


    function deploySourceEscrow(IOTypes.Order calldata order, bytes calldata signature) external payable {
        // Make sure that taker is paying security deposit
        require(msg.value >= security_deposit, "Security deposit not enough");

        // Check signature to confirm that order is coming from the maker
        bytes32 orderHash = keccak256(abi.encode(order));
        address signer = recoverSigner(orderHash, signature);
        require(signer == order.maker.bytes32ToAddress(), "Invalid signature");

        // Make sure that the maker already approved the source token amount
        bool success = IERC20(order.sourceToken.bytes32ToAddress()).transferFrom(order.maker.bytes32ToAddress(), address(this), order.sourceTokenAmount);
        require(success, "Maker must approve tokens to EscrowFactory");

        // Save order in memory and create an escrow
        orders[orderHash] = order;
        IOTypes.SourceEscrow memory escrow = IOTypes.SourceEscrow({
                    taker: msg.sender.addressToBytes32(),
                    fillAmount: order.sourceTokenAmount, // Can change this for partial fill
                    status: IOTypes.escrowStatus.CREATED,
                    timelock: order.timelock
        });
        sourceEscrows[orderHash].push(escrow);

        // Emit order created
        emit OrderCreated(
                orderHash,
                order.maker,
                order.receiver,
                order.sourceToken,
                order.destinationToken,
                order.destinationChain
        );
        // Emit deployment event
        emit SourceEscrowDeployed(orderHash, sourceEscrows[orderHash].length - 1);

        // Emit Order Complement
        emit OrderComplement(orderHash, // OrderId
                                    escrow.taker, // Taker
                                    order.receiver, // Receiver on other chain
                                    order.destinationToken,
                                    escrow.fillAmount,
                                    order.timelock,
                                    order.hashlock,
                                    order.destinationChain
                                    );

        // TODO: How to make sure order is coming from this contract??
    }


    function deployDestinationEscrow(IOTypes.OrderComplement calldata orderComplement) external payable {
        // Make sure that taker is paying security deposit
        require(msg.value >= security_deposit, "Security deposit not enough");

        // TODO: Make sure orderComplement isn't fudged in between

        // Make sure that the taker already approved the destination token amount
        bool success = IERC20(orderComplement.destinationToken.bytes32ToAddress()).transferFrom(
                                                                            orderComplement.taker.bytes32ToAddress(), 
                                                                            address(this), 
                                                                            orderComplement.fillAmount);
        require(success, "Taker must approve tokens to EscrowFactory");

        // Create a destination escrow
        IOTypes.DestinationEscrow memory escrow = IOTypes.DestinationEscrow({
                    taker: orderComplement.taker,
                    receiver: orderComplement.receiver,
                    destinationToken: orderComplement.destinationToken,
                    fillAmount: orderComplement.fillAmount,
                    hashlock: orderComplement.hashlock,
                    timelock: orderComplement.timelock,
                    status: IOTypes.escrowStatus.CREATED
        });
        destinationEscrows[orderComplement.orderId].push(escrow);

        // Emit Deployment Event
        emit DestinationEscrowDeployed(orderComplement.orderId, destinationEscrows[orderComplement.orderId].length - 1);
    }



    function withdrawSource(bytes32 orderId,bytes calldata secret, uint256 escrow_index) external {
        // Load the destination escrow from storage
        require(escrow_index < sourceEscrows[orderId].length, "Escrow not found.");
        IOTypes.SourceEscrow storage escrow= sourceEscrows[orderId][escrow_index];

        // Check if the status of escrow of escrow is correct
        require(escrow.status == IOTypes.escrowStatus.FILLED, "Not Withdrawable");

        // HASHLOCK: Check if hashlock is okay
        require(orders[orderId].hashlock == keccak256(secret), "Wrong Secret");

        // TIMELOCK: Determine if we're in private or public withdrawal window
        bool private_period = escrow.timelock+private_withdrawal_time>=block.timestamp;
        bool public_period = escrow.timelock+private_withdrawal_time<block.timestamp;
        bool taker_withdrawing = msg.sender == escrow.taker.bytes32ToAddress();
        require((private_period&&taker_withdrawing)||(public_period), "Not allowed");


        // Send to taker or caller depending on time
        bool success = IERC20(orders[orderId].sourceToken.bytes32ToAddress()).transfer(
            escrow.taker.bytes32ToAddress(), 
            escrow.fillAmount
            );
        require(success, "Transfer to taker failed");

        // Send safety deposit to the person who called the transfer function
        (bool sent, ) = msg.sender.call{value: security_deposit}("");
        require(sent, "Security deposit refund failed");

        // Udate the escrow status to prevent double-withdraw
        escrow.status = IOTypes.escrowStatus.WITHDRAWN;

        //Emit event
        emit EscrowWithdrawn("SOURCE", orderId, escrow_index, msg.sender);

        }

        function withdrawDestination(bytes32 orderId, bytes calldata secret, uint256 escrow_index) external {
            // Load the destination escrow from storage
            require(escrow_index < destinationEscrows[orderId].length, "Escrow not found.");
            IOTypes.DestinationEscrow storage escrow = destinationEscrows[orderId][escrow_index];

            // Check if the escrow status is FILLED and eligible for withdrawal
            require(escrow.status == IOTypes.escrowStatus.FILLED, "Not Withdrawable");

            // HASHLOCK: Validate hashlock against the provided secret
            require(escrow.hashlock == keccak256(secret), "Wrong Secret");

            // TIMELOCK: Determine if we're in private or public withdrawal window
            bool private_period = escrow.timelock + private_withdrawal_time >= block.timestamp;
            bool public_period = escrow.timelock + private_withdrawal_time < block.timestamp;
            bool receiver_withdrawing = msg.sender == escrow.receiver.bytes32ToAddress();
            require((private_period && receiver_withdrawing) || public_period, "Not allowed");

            // Transfer destination tokens to the receiver
            bool success = IERC20(escrow.destinationToken.bytes32ToAddress()).transfer(
                escrow.receiver.bytes32ToAddress(), 
                escrow.fillAmount
            );
            require(success, "Transfer to receiver failed");

            // Refund security deposit to the caller
            (bool sent, ) = msg.sender.call{value: security_deposit}("");
            require(sent, "Security deposit refund failed");

            // Udate the escrow status to prevent double-withdraw
            escrow.status = IOTypes.escrowStatus.WITHDRAWN;

            // Emit event
            emit EscrowWithdrawn("DESTINATION", orderId, escrow_index, msg.sender);
        }



        function getSourceEscrow(bytes32 orderId, uint256 escrow_index) external view returns (IOTypes.SourceEscrow memory) {
            require(escrow_index < sourceEscrows[orderId].length, "Escrow not found.");
            return sourceEscrows[orderId][escrow_index];
        }

        function getDestinationEscrow(bytes32 orderId, uint256 escrow_index) external view returns (IOTypes.DestinationEscrow memory) {
            require(escrow_index < destinationEscrows[orderId].length, "Escrow not found.");
            return destinationEscrows[orderId][escrow_index];
        }

}


