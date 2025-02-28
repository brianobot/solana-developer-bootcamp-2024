pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("FwaMx1RCzaeSU7azwoFE2Z6fsUn5E2ueHJ2DmLHQoXL2");

#[program]
pub mod swap {
    use super::*;

    pub fn make(ctx: Context<MakeOffer>, id: u64, amount: u64, amount_wanted: u64) -> Result<()> {
        instructions::make_offer::send_offer_tokens(&ctx, id, amount, amount_wanted)?;
        instructions::make_offer::save_offer(ctx, id, amount_wanted)?;
        Ok(())
    }
    
    pub fn take(ctx: Context<TakeOffer>) -> Result<()> {
        instructions::take_offer::send_wanted_tokens_to_maker(&ctx)?;
        instructions::take_offer::withdraw_offer_tokens_and_close_offer(ctx)?;
        Ok(())
    }
}
