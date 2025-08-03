use ink::prelude::vec::Vec;
use scale::{Decode, Encode};
use ink::storage::traits::StorageLayout;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Encode, Decode, scale_info::TypeInfo)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
pub enum Chains {
    POL,
    DOT,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Encode, Decode, scale_info::TypeInfo)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
pub enum EscrowStatus {
    CREATED,
    FILLED,
    WITHDRAWN,
}

#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode, scale_info::TypeInfo)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
pub struct Order {
    pub maker: [u8; 32],
    pub receiver: [u8; 32],
    pub source_token: [u8; 32],
    pub destination_token: [u8; 32],
    pub source_token_amount: u128,
    pub destination_token_amount: u128,
    pub source_chain: Chains,
    pub destination_chain: Chains,
    pub allow_partial_fill: bool,
    pub hashlock: [u8; 32],
    pub timelock: u64,
}

#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode, scale_info::TypeInfo)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
pub struct OrderComplement {
    pub order_id: [u8; 32],
    pub taker: [u8; 32],
    pub receiver: [u8; 32],
    pub destination_token: [u8; 32],
    pub fill_amount: u128,
    pub timelock: u64,
    pub hashlock: [u8; 32],
    pub destination_chain: Chains,
}

#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode, scale_info::TypeInfo)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
pub struct SourceEscrow {
    pub taker: [u8; 32],
    pub fill_amount: u128,
    pub status: EscrowStatus,
    pub timelock: u64,
}

#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode, scale_info::TypeInfo)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
pub struct DestinationEscrow {
    pub taker: [u8; 32],
    pub receiver: [u8; 32],
    pub destination_token: [u8; 32],
    pub fill_amount: u128,
    pub hashlock: [u8; 32],
    pub timelock: u64,
    pub status: EscrowStatus,
}

