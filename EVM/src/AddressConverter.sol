// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library AddressConverter {
    /// @notice Converts an Ethereum address (20 bytes) to bytes32 (left-padded with zeros)
    /// @param addr Ethereum address to convert
    /// @return bytes32 representation of the address
    function addressToBytes32(address addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

    /// @notice Converts bytes32 to an Ethereum address by taking the last 20 bytes
    /// @param b32 bytes32 to convert (assumed to store an address in the lower 20 bytes)
    /// @return addr Ethereum address extracted from bytes32
    function bytes32ToAddress(bytes32 b32) internal pure returns (address) {
        return address(uint160(uint256(b32)));
    }
}
