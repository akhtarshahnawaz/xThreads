// If the `std` feature from the `Cargo.toml` is not enabled
// we switch on `no_std`, this has the effect of Rusts standard
// library not being included in our contract.

// The Rust standard library is OS-dependent and Wasm is
// architecture independent.
#![cfg_attr(not(feature = "std"), no_std, no_main)]


// This is the ink! macro, the starting point for your contract.
// Everything below it might look like Rust code, but it is actually
// run through a parser in ink!.
#[ink::contract]
pub mod escrow_factory {
    use ink::storage::Mapping;

    use ink::storage::traits::Packed;
    use scale::{Encode, Decode};
    use ink_storage::{collections::HashMap};


    #[derive(Debug, Clone, Encode, Decode, ink_storage_derive::PackedLayout, ink_storage_derive::SpreadLayout)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Order {
        maker: [u8; 32],            
        receiver: [u8; 32],
        sourceToken: [u8; 32],
        destinationToken: [u8; 32],
    }


    /// This is the contract's storage.
    #[ink(storage)]
    #[derive(Default)]
    pub struct EscrowFactory {
        orders: HashMap<[u8; 32], Order>,

    }

    impl EscrowFactory {
        /// A constructor that the contract can be initialized with.
        #[ink(constructor)]
        pub fn new() -> Self {
            let orders = HashMap::new();

            Self {orders: orders}
        }


        /// A state-mutating function that the contract exposes to the
        /// outside world. By default functions are private, they have to be annotated
        /// with `#[ink(message)]` and `pub` to be available from the
        /// outside.
        #[ink(message)]
        pub fn flip(&mut self) {
            
        }

        /// A public contract function that has no side-effects.
        ///
        /// Note that while purely reading functions can be invoked
        /// by submitting a transaction on-chain, this is usually
        /// not done as they have no side-effects and the transaction
        /// costs would be wasted.
        /// Instead those functions are typically invoked via RPC to
        /// return a contract's state.
        #[ink(message)]
        pub fn get(&self) -> bool {
            true
        }
    }

}