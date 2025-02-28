use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token_interface::{Mint, TokenInterface, TokenAccount}};

use crate::state::Offer;
use crate::constants::ANCHOR_DESCRIMINATOR;


#[derive(Accounts)]
#[instruction(id: u64)]
pub struct MakeOffer<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(
        mint::token_program = token_program,
    )]
    pub token_mint_a: InterfaceAccount<'info, Mint>,
    #[account(
        mint::token_program = token_program,
    )]
    pub token_mint_b: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = token_mint_a,
        associated_token::authority = maker,
        associated_token::token_program = token_program,
    )]
    pub maker_token_account_a: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = maker,
        space = ANCHOR_DESCRIMINATOR + Offer::INIT_SPACE,
        seeds = [b"offer", maker.key().as_ref(), id.to_le_bytes().as_ref()],
        bump,
    )]
    pub offer: Account<'info, Offer>,
    #[account(
        init,
        payer = maker,
        associated_token::mint = token_mint_a,
        associated_token::authority = offer,
        associated_token::token_program = token_program,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}


pub fn send_offer_tokens(ctx: &Context<MakeOffer>) -> Result<()> {
    Ok(())
}

pub fn save_offer(ctx: &Context<MakeOffer>) -> Result<()> {
    Ok(())
}
