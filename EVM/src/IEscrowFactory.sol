// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./IOTypes.sol";

interface IEscrowFactory {

    // Order Creation
    event OrderCreated(
                bytes32 indexed orderId,
                bytes32 maker,
                bytes32 receiver,
                bytes32 sourceToken,
                bytes32 destinationToken,
                IOTypes.Chains destinationChain
    );



    // Escrow Deployments
    event SourceEscrowDeployed(bytes32 indexed orderId, uint256 escrowIndex);
    event DestinationEscrowDeployed(bytes32 indexed orderId, uint256 escrowIndex);


    // Escrow Withdrawal
    event EscrowWithdrawn(string escrowType, bytes32 orderId, uint256 escrowIndex, address withdrawnBy);

    // Order Complement Announcement
    event OrderComplement(
                    bytes32 indexed orderId,
                    bytes32 taker,
                    bytes32 receiver,
                    bytes32 destinationToken,
                    uint256 fillAmount,
                    uint256 timelock,
                    bytes32 hashlock,
                    IOTypes.Chains destinationChain
                );
        }

