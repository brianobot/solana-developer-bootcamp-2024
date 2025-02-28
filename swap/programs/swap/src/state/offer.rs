use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct Offer {
    pub id: u64,
    pub maker: Pubkey,
    pub mint_a: Pubkey,
    pub mint_b: Pubkey,
    pub token_b_wanted_amount: u64,
    pub created_at: u64,
    pub updated_at: u64,
    pub bump: u8,
}