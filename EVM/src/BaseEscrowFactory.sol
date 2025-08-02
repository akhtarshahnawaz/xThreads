// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./IOTypes.sol";
import "./IEscrowFactory.sol";

abstract contract BaseEscrowFactory is IEscrowFactory {
    using IOTypes for *;

    address public immutable owner;
    uint256 public private_withdrawal_time;
    uint256 public public_withdrawal_time;
    uint256 public expiry_withdrawal_time;
    uint256 public security_deposit;
    
    constructor(address _owner, uint256 _privateTime, uint256 _publicTime, uint256 _expiryTime, uint256 _securityDeposit) {
        owner = _owner;
        private_withdrawal_time = _privateTime;
        public_withdrawal_time = _publicTime;
        expiry_withdrawal_time = _expiryTime;
        security_deposit = _securityDeposit;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function recoverSigner(bytes32 dataHash, bytes memory signature) internal pure returns (address) {
        bytes32 ethSignedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", dataHash));
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(ethSignedHash, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    function updateWithdrawalTimes(uint256 _privateTime, uint256 _publicTime, uint256 _expiryTime) external onlyOwner {
        private_withdrawal_time = _privateTime;
        public_withdrawal_time = _publicTime;
        expiry_withdrawal_time = _expiryTime;
    }


}
