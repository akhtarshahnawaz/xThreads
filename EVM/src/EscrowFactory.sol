// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./IOTypes.sol";
import "./BaseEscrowFactory.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "./AddressConverter.sol";

contract EscrowFactory is BaseEscrowFactory{
    using IOTypes for *;

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
        address makerAddress = address(uint160(uint256(order.maker)));
        require(signer == AddressConverter.bytes32ToAddress(order.maker), "Invalid signature");

        // Make sure that the maker already approved the source token amount
        bool success = IERC20(AddressConverter.bytes32ToAddress(order.sourceToken)).transferFrom(AddressConverter.bytes32ToAddress(order.maker), address(this), order.sourceTokenAmount);
        require(success, "Maker must approve tokens to EscrowFactory");

        // Save order in memory and create an escrow
        orders[orderHash] = order;
        IOTypes.SourceEscrow memory escrow = IOTypes.SourceEscrow({
                    taker: AddressConverter.addressToBytes32(msg.sender),
                    fillAmount: order.sourceTokenAmount,
                    status: IOTypes.escrowStatus.CREATED,
                    timelock: order.timelock
        });
        sourceEscrows[orderHash].push(escrow);

        // Announce order complement 
        // TODO: How to make sure order is coming from this contract??
        // How to emit event
    }



    function deployDestinationEscrow(IOTypes.OrderComplement calldata orderComplement) external {
        // Make sure that taker is paying security deposit
        require(msg.value >= security_deposit, "Security deposit not enough");

        // Make sure orderComplement isn't fudged in between

        // Make sure that the taker already approved the destination token amount
        bool success = IERC20(orderComplement.destinationToken).transferFrom(address(orderComplement.taker), address(this), orderComplement.destinationTokenAmount);
        require(success, "Taker must approve enough tokens to EscrowFactory");

        // Create a destination escrow
        IOTypes.DestinationEscrow memory escrow = IOTypes.SourceEscrow({
                    taker: orderComplement.taker,
                    receiver: orderComplement.receiver,
                    destinationToken: orderComplement.destinationToken,
                    fillAmount: orderComplement.destinationTokenAmount,
                    status: IOTypes.escrowStatus.CREATED,
                    timelock: orderComplement.timelock,
                    hashlock: orderComplement.hashlock
        });
        destinationEscrows[orderComplement.orderId].push(escrow);


        emit DestinationEscrowDeployed(orderComplement.orderId, orderComplement.destinationChainReceiver,orderComplement.amountReceived);
    }



    function withdraw(bytes32 orderId,bytes32 secret) external {
        IOTypes.SourceEscrow memory escrow= sourceEscrows[orderId];

        // Check if the status of escrow of escrow is correct
        require(escrow.state == IOTypes.escrowStatus.CREATED, "Not Withdrawable");

        // Check if hashlock is okay
        require(escrow.hashlock == keccak256(secret), "Wrong Secret");

        // Check who can withdraw at the moment based on timelock
        bool private_period = escrow.timelock+this.private_withdrawal_time>=block.timestamp;
        bool public_period = escrow.timelock+this.private_withdrawal_time<block.timestamp;
        bool taker_withdrawing = msg.sender == escrow.taker;
        require((private_period&&taker_withdrawing)||(public_period), "Not allowed");


        // Send to taker or caller depending on time
        bool success = IERC20(orders[orderId].sourceToken).transfer(escrow.taker, escrow.fillAmount);
        require(success, "Transfer to taker failed");

        // Send safety deposit to the person who called the transfer function
        bool success = msg.sender.call{value: this.security_deposit}("");
        require(success, "Transfer failed");

        //Emit some event here
        }
}


