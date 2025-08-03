#![cfg_attr(not(feature = "std"), no_std)]

pub mod types;
pub mod address_converter;
pub mod base_escrow_factory;

use ink::prelude::{vec::Vec};
use ink::storage::Mapping;
use types::*;
use address_converter::*;
use base_escrow_factory::*;


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

#[ink::contract]
pub mod escrow_factory {
    use super::*;

    #[ink(storage)]
    pub struct EscrowFactory {
        config: Config,
        orders: Mapping<[u8; 32], Order>,
        source_escrows: Mapping<[u8; 32], Vec<SourceEscrow>>,
        destination_escrows: Mapping<[u8; 32], Vec<DestinationEscrow>>,
    }

    #[ink(event)]
    pub struct OrderCreated {
        #[ink(topic)] order_id: [u8; 32],
        maker: [u8; 32],
        receiver: [u8; 32],
        source_token: [u8; 32],
        destination_token: [u8; 32],
        destination_chain: Chains,
    }

    #[ink(event)]
    pub struct EscrowWithdrawn {
        escrow_type: String,
        order_id: [u8; 32],
        escrow_index: u32,
        withdrawn_by: AccountId,
    }

    impl EscrowFactory {
        #[ink(constructor)]
        pub fn new(owner: AccountId, private: u64, public: u64, expiry: u64, deposit: u128) -> Self {
            let config = Config {
                owner,
                private_withdrawal_time: private,
                public_withdrawal_time: public,
                expiry_withdrawal_time: expiry,
                security_deposit: deposit,
            };
            Self {
                config,
                orders: Mapping::default(),
                source_escrows: Mapping::default(),
                destination_escrows: Mapping::default(),
            }
        }

        #[ink(message, payable)]
        pub fn deploy_source_escrow(&mut self, order: Order, signature: Vec<u8>) {
            assert!(self.env().transferred_value() >= self.config.security_deposit, "Security deposit too low");

            // Signature validation is omitted: implement it using ink's offchain verifier
            let order_id = self.hash_order(&order);
            self.orders.insert(order_id, &order);

            let escrow = SourceEscrow {
                taker: address_to_bytes32(self.env().caller()),
                fill_amount: order.source_token_amount,
                status: EscrowStatus::CREATED,
                timelock: order.timelock,
            };

            let mut escrows = self.source_escrows.get(order_id).unwrap_or_default();
            escrows.push(escrow);
            self.source_escrows.insert(order_id, &escrows);

            self.env().emit_event(OrderCreated {
                order_id,
                maker: order.maker,
                receiver: order.receiver,
                source_token: order.source_token,
                destination_token: order.destination_token,
                destination_chain: order.destination_chain,
            });
        }

        #[ink(message)]
        pub fn get_source_escrow(&self, order_id: [u8; 32], index: u32) -> Option<SourceEscrow> {
            self.source_escrows
                .get(order_id)
                .and_then(|escrows| escrows.get(index as usize).cloned())
        }

        fn hash_order(&self, order: &Order) -> [u8; 32] {
            use ink::env::hash::{Sha2x256, HashOutput};
            let mut result = <Sha2x256 as HashOutput>::Type::default();
            let encoded = scale::Encode::encode(order);
            ink::env::hash_bytes::<Sha2x256>(&encoded, &mut result);
            result
        }

        // Add other message methods like withdraw, deployDestinationEscrow similarly
    }
}
