// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./IOTypes.sol";
import "./BaseEscrowFactory.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";


contract EscrowFactory is BaseEscrowFactory{
    using IOTypes for *;

    mapping(bytes32 => IOTypes.Order) public orders;
    mapping(bytes32 => IOTypes.SourceEscrow[]) public sourceEscrows;
    mapping(bytes32 => IOTypes.DestinationEscrow[]) public destinationEscrows;


    constructor(address _owner, uint256 _privateTime, uint256 _publicTime, uint256 _expiryTime, uint256 _securityDeposit) 
        BaseEscrowFactory(_owner, _privateTime, _publicTime, _expiryTime, _securityDeposit){}


    function deploySourceEscrow(IOTypes.Order calldata order, bytes calldata signature) external payable {
        // Make sure that taker is paying security deposit
        require(msg.value >= this.security_deposit, "Security deposit not enough");

        // Check signature to confirm that order is coming from the maker
        bytes32 orderHash = keccak256(abi.encode(order));
        address signer = recoverSigner(orderHash, signature);
        require(signer == address(order.maker), "Invalid signature");

        // Make sure that the maker already approved the source token amount
        bool success = IERC20(order.sourceToken).transferFrom(address(order.maker), address(this), order.sourceTokenAmount);
        require(success, "Maker must approve tokens to EscrowFactory");

        // Save order in memory and create an escrow
        orders[orderHash] = order;
        IOTypes.SourceEscrow memory escrow = IOTypes.SourceEscrow({
                    taker: order.taker,
                    fillAmount: order.sourceTokenAmount,
                    status: IOTypes.escrowStatus.CREATED,
                    timelock: order.timelock
        });
        sourceEscrows[orderHash].push(escrow);

        // Announce order complement TODO: How to make sure order is coming from this contract??

        emit SourceEscrowDeployed(orderHash, msg.sender, msg.value);
    }



    function deployDestinationEscrow(IOTypes.OrderComplement calldata orderComplement) external {
        // Make sure that taker is paying security deposit
        require(msg.value >= this.security_deposit, "Security deposit not enough");

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

    function withdraw(bytes32 orderId, bool isSource, uint256 index) external {
        // Check if the status of escrow of escrow is correct
        // Check if hashlock is okay
        // Check who can withdraw at the moment based on timelock
        // Send to taker or caller depending on time

        if (isSource) {
            IOTypes.SourceEscrow storage escrow = sourceEscrows[orderId][index];
            require(
                escrow.status == IOTypes.escrowStatus.CREATED ||
                escrow.status == IOTypes.escrowStatus.EXPIRED,
                "Not withdrawable"
            );
            require(msg.sender == escrow.taker, "Only taker can withdraw");

            IOTypes.Order storage order = orders[orderId];
            escrow.status = IOTypes.escrowStatus.WITHDRAWN;

            bool success = IERC20(order.sourceToken).transfer(msg.sender, escrow.fillAmount);
            require(success, "Transfer failed");

            emit SourceEscrowWithdrawn(orderId, msg.sender, escrow.fillAmount);
        } else {
            IOTypes.DestinationEscrow storage escrow = destinationEscrows[orderId][index];
            require(
                escrow.status == IOTypes.escrowStatus.CREATED ||
                escrow.status == IOTypes.escrowStatus.EXPIRED,
                "Not withdrawable"
            );
            require(msg.sender == escrow.receiver, "Only receiver can withdraw");

            escrow.status = IOTypes.escrowStatus.WITHDRAWN;

            bool success = IERC20(escrow.destinationToken).transfer(msg.sender, escrow.fillAmount);
            require(success, "Transfer failed");

            emit DestinationEscrowWithdrawn(orderId, msg.sender, escrow.fillAmount);
        }
    }

}
