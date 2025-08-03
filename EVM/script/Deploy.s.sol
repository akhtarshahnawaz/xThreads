// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/forge-std/src/Script.sol";
import "../src/EscrowFactory.sol"; // Adjust path if needed

contract DeployEscrowFactory is Script {
    function run() external {


        // Current block timestamp
        uint256 nowTimestamp = block.timestamp;

        // Define timing parameters (in seconds)
        uint256 privateTime = nowTimestamp + 1 hours;        // 1 hour from now
        uint256 publicTime  = nowTimestamp + 6 hours;        // 6 hours from now
        uint256 expiryTime  = nowTimestamp + 24 hours;       // 1 day from now

        // Define security deposit in wei (e.g., 0.01 ETH)
        uint256 securityDeposit = 0.01 ether;

        // Deploy EscrowFactory with msg.sender as the owner
        EscrowFactory escrowFactory = new EscrowFactory(msg.sender, privateTime, publicTime, expiryTime, securityDeposit);

        console.log("EscrowFactory deployed at:", address(escrowFactory));

        vm.stopBroadcast();
    }
}
