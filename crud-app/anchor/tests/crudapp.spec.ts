import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { Crudapp }  from '../target/types/crudapp'
import { confirmTransaction } from "@solana-developers/helpers"
import { before } from 'node:test'



describe('crudapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  
  anchor.setProvider(provider)
  
  const program = anchor.workspace.Crudapp as Program<Crudapp>
  
  const user = Keypair.generate()

  const connection  = program.provider.connection;
  
  const payer = provider.wallet as anchor.Wallet
  let journalEntry: PublicKey;
  let bump: Number;

  before(async() => {
    [journalEntry, bump] = PublicKey.findProgramAddressSync([
      Buffer.from("journal_entry"),
      user.publicKey.toBuffer(),
      Buffer.from("Test Journal Entry"),
    ], program.programId);

    console.log("✅ Journal Entry Account: ", journalEntry);
  });

  it('Create Journal Entry!', async () => {
    await airdrop(connection, user.publicKey, 10);

    let tx = await program.methods
    .createJournalEntry(
      "Test Journal Entry",
      "Initial Message in my journal Entry."
    )
    .accountsPartial({
      user: user.publicKey,
    })
    .signers([user])
    .rpc();

    console.log("Transaction for Create Journal Entry: ", tx);
  })
  
  it('Update Journal Entry!', async () => {
    let tx = await program.methods
    .updateJournalEntry(
      "Update Message in my journal Entry."
    )
    .accountsPartial({
      user: user.publicKey,
      journalEntry: journalEntry,
    })
    .signers([user])
    .rpc();

    console.log("Transaction for Update Journal Entry: ", tx);
  })
  
  it('Close Journal Entry!', async () => {
    let tx = await program.methods
    .closeJournalEntry()
    .accountsPartial({
      user: user.publicKey,
      journalEntry: journalEntry,
    })
    .signers([user])
    .rpc();

    console.log("Transaction for Close Journal Entry: ", tx);
  })

})


async function airdrop(connection: anchor.web3.Connection, address: PublicKey, amount: number) {
  let airdrop_signature = await connection.requestAirdrop(
    address,
    amount * LAMPORTS_PER_SOL
  );
  // console.log("✍🏾 Airdrop Signature: ", airdrop_signature);

  let confirmedAirdrop = await confirmTransaction(connection, airdrop_signature, "confirmed");

  // console.log(`🪂 Airdropped ${amount} SOL to ${address.toBase58()}`);
  // console.log("✅ Tx Signature: ", confirmedAirdrop);

  return confirmedAirdrop;
}