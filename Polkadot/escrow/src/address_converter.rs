pub fn address_to_bytes32(addr: AccountId) -> [u8; 32] {
    let mut result = [0u8; 32];
    result[12..].copy_from_slice(&addr.as_ref()[..20]);
    result
}

pub fn bytes32_to_address(b: [u8; 32]) -> AccountId {
    use ink::env::hash;
    let mut truncated = [0u8; 32];
    truncated.copy_from_slice(&b);
    AccountId::from(truncated)
}

