#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{
        dispatch::DispatchResultWithPostInfo,
        pallet_prelude::*,
        traits::{Currency, ExistenceRequirement::AllowDeath, Time},
    };
    use frame_system::pallet_prelude::*;
    use sp_runtime::traits::{Hash, Zero};
    use sp_std::vec::Vec;

    type BalanceOf<T> =
        <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;
    type MomentOf<T> = <<T as Config>::Time as Time>::Moment;

    #[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo)]
    pub enum HtlcStatus {
        Open,
        Claimed,
        Refunded,
        Cancelled,
        Expired,
    }

    #[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo)]
    pub struct Htlc<AccountId, Balance, Moment> {
        pub sender: AccountId,
        pub receiver: AccountId,
        pub amount: Balance,
        pub hashlock: [u8; 32],
        pub timelock: Moment,
        pub preimage: Option<Vec<u8>>,
        pub status: HtlcStatus,
    }

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        type Currency: Currency<Self::AccountId>;
        type Time: Time;
        #[pallet::constant]
        type MaxPreimageLength: Get<u32>;
    }

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::storage]
    #[pallet::getter(fn htlcs)]
    pub type Htlcs<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::Hash,
        Htlc<T::AccountId, BalanceOf<T>, MomentOf<T>>,
        OptionQuery,
    >;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        HtlcCreated {
            id: T::Hash,
            sender: T::AccountId,
            receiver: T::AccountId,
            amount: BalanceOf<T>,
            timelock: MomentOf<T>,
        },
        HtlcClaimAttempt {
            id: T::Hash,
            claimer: T::AccountId,
        },
        HtlcClaimed {
            id: T::Hash,
            receiver: T::AccountId,
            preimage: Vec<u8>,
        },
        HtlcRefundAttempt {
            id: T::Hash,
            sender: T::AccountId,
        },
        HtlcRefunded {
            id: T::Hash,
            sender: T::AccountId,
        },
        HtlcExpired {
            id: T::Hash,
        },
        HtlcCancelled {
            id: T::Hash,
        },
    }

    #[pallet::error]
    pub enum Error<T> {
        HtlcNotFound,
        InvalidPreimage,
        TimelockNotExpired,
        AlreadyCompleted,
        TimelockTooShort,
        NotAuthorized,
        PreimageTooLong,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn create_htlc(
            origin: OriginFor<T>,
            receiver: T::AccountId,
            hashlock: [u8; 32],
            timelock: MomentOf<T>,
            amount: BalanceOf<T>,
        ) -> DispatchResultWithPostInfo {
            let sender = ensure_signed(origin)?;
            ensure!(timelock > T::Time::now(), Error::<T>::TimelockTooShort);

            let now = T::Time::now();
            let id = T::Hashing::hash_of(&(sender.clone(), receiver.clone(), hashlock, timelock, amount, now));

            let htlc = Htlc {
                sender: sender.clone(),
                receiver: receiver.clone(),
                amount,
                hashlock,
                timelock,
                preimage: None,
                status: HtlcStatus::Open,
            };

            T::Currency::transfer(&sender, &Self::account_id(), amount, AllowDeath)?;
            <Htlcs<T>>::insert(&id, htlc);

            Self::deposit_event(Event::HtlcCreated {
                id,
                sender,
                receiver,
                amount,
                timelock,
            });

            Ok(().into())
        }

        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn claim(
            origin: OriginFor<T>,
            id: T::Hash,
            preimage: Vec<u8>,
        ) -> DispatchResultWithPostInfo {
            let claimer = ensure_signed(origin)?;
            ensure!(preimage.len() <= T::MaxPreimageLength::get() as usize, Error::<T>::PreimageTooLong);
            Self::deposit_event(Event::HtlcClaimAttempt { id, claimer: claimer.clone() });

            Htlcs::<T>::try_mutate(&id, |maybe_htlc| {
                let htlc = maybe_htlc.as_mut().ok_or(Error::<T>::HtlcNotFound)?;
                ensure!(htlc.status == HtlcStatus::Open, Error::<T>::AlreadyCompleted);
                ensure!(claimer == htlc.receiver, Error::<T>::NotAuthorized);

                let hash = T::Hashing::hash(&preimage);
                ensure!(hash.as_ref() == htlc.hashlock, Error::<T>::InvalidPreimage);

                htlc.status = HtlcStatus::Claimed;
                htlc.preimage = Some(preimage.clone());

                T::Currency::transfer(&Self::account_id(), &htlc.receiver, htlc.amount, AllowDeath)?;
                Self::deposit_event(Event::HtlcClaimed {
                    id,
                    receiver: htlc.receiver.clone(),
                    preimage,
                });
                Ok(())
            })?;

            Ok(().into())
        }

        #[pallet::call_index(2)]
        #[pallet::weight(10_000)]
        pub fn refund(origin: OriginFor<T>, id: T::Hash) -> DispatchResultWithPostInfo {
            let sender = ensure_signed(origin)?;
            Self::deposit_event(Event::HtlcRefundAttempt { id, sender: sender.clone() });

            Htlcs::<T>::try_mutate(&id, |maybe_htlc| {
                let htlc = maybe_htlc.as_mut().ok_or(Error::<T>::HtlcNotFound)?;
                ensure!(htlc.status == HtlcStatus::Open, Error::<T>::AlreadyCompleted);
                ensure!(sender == htlc.sender, Error::<T>::NotAuthorized);

                let now = T::Time::now();
                ensure!(now > htlc.timelock, Error::<T>::TimelockNotExpired);

                htlc.status = HtlcStatus::Refunded;

                T::Currency::transfer(&Self::account_id(), &htlc.sender, htlc.amount, AllowDeath)?;
                Self::deposit_event(Event::HtlcRefunded {
                    id,
                    sender: htlc.sender.clone(),
                });

                Ok(())
            })?;

            Ok(().into())
        }

        #[pallet::call_index(3)]
        #[pallet::weight(10_000)]
        pub fn cancel(origin: OriginFor<T>, id: T::Hash) -> DispatchResultWithPostInfo {
            let caller = ensure_signed(origin)?;
            Htlcs::<T>::try_mutate_exists(&id, |maybe_htlc| {
                let htlc = maybe_htlc.take().ok_or(Error::<T>::HtlcNotFound)?;
                ensure!(caller == htlc.sender, Error::<T>::NotAuthorized);
                ensure!(htlc.status == HtlcStatus::Open, Error::<T>::AlreadyCompleted);

                // Refund to sender immediately
                T::Currency::transfer(&Self::account_id(), &htlc.sender, htlc.amount, AllowDeath)?;

                Self::deposit_event(Event::HtlcCancelled { id });
                Ok(())
            })?;

            Ok(().into())
        }
    }

    impl<T: Config> Pallet<T> {
        pub fn account_id() -> T::AccountId {
            frame_support::PalletId(*b"htlc/esc").into_account_truncating()
        }
    }
}
