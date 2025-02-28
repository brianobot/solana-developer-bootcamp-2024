use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{ transfer_checked, TransferChecked}, token_interface::{ close_account, CloseAccount, Mint, TokenAccount, TokenInterface }};

use crate::state::Offer;
use crate::instructions::shared::transfer_tokens;


#[derive(Accounts)]
#[instruction(id: u64)]
pub struct TakeOffer<'info> {
    #[account(mut)]
    pub taker: Signer<'info>,
    #[account(
        mut, 
        address = offer.maker
    )]
    pub maker: SystemAccount<'info>,

    #[account(
        mint::token_program = token_program,
    )]
    pub token_mint_a: InterfaceAccount<'info, Mint>,
    
    #[account(
        mint::token_program = token_program,
    )]
    pub token_mint_b: InterfaceAccount<'info, Mint>,

    #[account(
        init_if_needed,
        payer = taker,
        associated_token::mint = token_mint_a,
        associated_token::authority = taker,
        associated_token::token_program = token_program,
    )]
    pub taker_token_account_a: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = token_mint_b,
        associated_token::authority = taker,
        associated_token::token_program = token_program,
    )]
    pub taker_token_account_b: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        init_if_needed,
        payer = taker,
        associated_token::mint = token_mint_b,
        associated_token::authority = maker,
        associated_token::token_program = token_program,
    )]
    pub maker_token_account_b: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        close = maker,
        has_one = maker,
        has_one = token_mint_a,
        has_one = token_mint_b,
        seeds = [b"offer", maker.key().as_ref(), offer.id.to_le_bytes().as_ref()],
        bump = offer.bump,
    )]
    pub offer: Account<'info, Offer>,
    #[account(
        mut,
        associated_token::mint = token_mint_a,
        associated_token::authority = offer,
        associated_token::token_program = token_program,
    )]
    pub vault: Box<InterfaceAccount<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}


pub fn send_wanted_tokens_to_maker(ctx: &Context<TakeOffer>,) -> Result<()> {
    transfer_tokens(
        &ctx.accounts.taker_token_account_b,
        &ctx.accounts.maker_token_account_b,
        &ctx.accounts.offer.token_b_wanted_amount,
        &ctx.accounts.token_mint_b,
        &ctx.accounts.taker,
        &ctx.accounts.token_program
    )?;
    Ok(())
}

pub fn withdraw_offer_tokens_and_close_offer(ctx: Context<TakeOffer>) -> Result<()> {
    let cpi_program = ctx.accounts.token_program.to_account_info();

    let cpi_accounts = TransferChecked {
        from: ctx.accounts.vault.to_account_info(),
        mint: ctx.accounts.token_mint_a.to_account_info(),
        to: ctx.accounts.taker_token_account_a.to_account_info(),
        authority: ctx.accounts.offer.to_account_info(),
    };

    let seeds = [
        b"offer", 
        ctx.accounts.maker.to_account_info().key.as_ref(), 
        &ctx.accounts.offer.id.to_le_bytes()[..],
        &[ctx.accounts.offer.bump],
    ];

    let signer_seeds = &[&seeds[..]];

    let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

    transfer_checked(cpi_context, ctx.accounts.vault.amount, ctx.accounts.token_mint_a.decimals)?;

    let cpi_program = ctx.accounts.token_program.to_account_info();

    let cpi_accounts = CloseAccount {
        account: ctx.accounts.vault.to_account_info(),
        destination: ctx.accounts.maker.to_account_info(),
        authority: ctx.accounts.offer.to_account_info(),
    };

    let signer_seeds = &[&seeds[..]];

    let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

    close_account(cpi_context)?;
    
    Ok(())
}

