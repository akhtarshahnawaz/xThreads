// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IEscrowFactory {
    event SourceEscrowDeployed(bytes32 indexed orderId, address sender, uint256 amount);
    event DestinationEscrowDeployed(bytes32 indexed orderId, address receiver, uint256 amount);



}
