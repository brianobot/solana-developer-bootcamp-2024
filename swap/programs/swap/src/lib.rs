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

    pub fn make(ctx: Context<MakeOffer>) -> Result<()> {
        instructions::make_offer::send_offer_tokens(&ctx)?;
        instructions::make_offer::save_offer(&ctx)?;
        Ok(())
    }
}
