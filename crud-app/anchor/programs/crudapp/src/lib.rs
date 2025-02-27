#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod crudapp {
    use super::*;

    pub fn create_journal_entry(ctx: Context<CreateJournalEntry>, title: String, message: String) -> Result<()> {
        let clock = Clock::get()?;

        ctx.accounts.journal_entry.set_inner( JournalEntry { 
            owner: ctx.accounts.user.key(), 
            title, 
            message, 
            created_at: clock.unix_timestamp as u64, 
            updated_at: clock.unix_timestamp as u64, 
            bump: ctx.bumps.journal_entry,
        });

        Ok(())
    }

    pub fn update_journal_entry(ctx: Context<UpdateJournalEntry>, message: String) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;

        journal_entry.message = message;
        journal_entry.updated_at = Clock::get()?.unix_timestamp as u64;

        Ok(())
    }
    
    pub fn close_journal_entry(_ctx: Context<CloseJournalEntry>) -> Result<()> {
        Ok(())
    }


}

#[account]
#[derive(InitSpace)]
pub struct JournalEntry {
    pub owner: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(50)]
    pub message: String,
    pub created_at: u64,
    pub updated_at: u64,
    pub bump: u8,
}


#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateJournalEntry<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = 8 + JournalEntry::INIT_SPACE,
        seeds = [b"journal_entry", user.key().as_ref(), title.as_bytes()],
        bump,
    )]
    pub journal_entry: Account<'info, JournalEntry>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct UpdateJournalEntry<'info> {
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"journal_entry", user.key().as_ref(), journal_entry.title.as_bytes()],
        bump = journal_entry.bump,
    )]
    pub journal_entry: Account<'info, JournalEntry>,
}


#[derive(Accounts)]
pub struct CloseJournalEntry<'info> {
    pub user: Signer<'info>,
    #[account(
        mut,
        close = user,
        seeds = [b"journal_entry", user.key().as_ref(), journal_entry.title.as_bytes()],
        bump = journal_entry.bump,
    )]
    pub journal_entry: Account<'info, JournalEntry>,
}