use ink::prelude::*;
use ink::storage::traits::StorageLayout;

#[derive(Default, scale::Encode, scale::Decode, scale_info::TypeInfo)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
pub struct Config {
    pub owner: AccountId,
    pub private_withdrawal_time: u64,
    pub public_withdrawal_time: u64,
    pub expiry_withdrawal_time: u64,
    pub security_deposit: u128,
}

