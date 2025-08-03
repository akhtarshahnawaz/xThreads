// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library IOTypes {
    enum Chains {POL, DOT}
    enum escrowStatus {CREATED, FILLED, WITHDRAWN}

    struct Order {
        bytes32 maker;
        bytes32 receiver;
        bytes32 sourceToken;
        bytes32 destinationToken;
        uint256 sourceTokenAmount;
        uint256 destinationTokenAmount;
        Chains sourceChain;
        Chains destinationChain;
        bool allowPartialFill;
        bytes32 hashlock;
        uint256 timelock;
    }

    struct OrderComplement {
        bytes32 orderId;
        bytes32 taker;
        bytes32 receiver;
        bytes32 destinationToken;
        uint256 fillAmount;
        uint256 timelock;
        bytes32 hashlock;
        IOTypes.Chains destinationChain;
    }

    struct SourceEscrow {
        bytes32 taker;
        uint256 fillAmount;
        escrowStatus status;
        uint256 timelock;
    }

    struct DestinationEscrow {
        bytes32 taker;
        bytes32 receiver;
        bytes32 destinationToken;
        uint256 fillAmount;
        bytes32 hashlock;
        uint256 timelock;
        escrowStatus status;
    }
}
