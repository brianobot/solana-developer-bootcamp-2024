import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Crudapp} from '../target/types/crudapp'

describe('crudapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Crudapp as Program<Crudapp>

  const crudappKeypair = Keypair.generate()

  it('Initialize Crudapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        crudapp: crudappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([crudappKeypair])
      .rpc()

    const currentCount = await program.account.crudapp.fetch(crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Crudapp', async () => {
    await program.methods.increment().accounts({ crudapp: crudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.crudapp.fetch(crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Crudapp Again', async () => {
    await program.methods.increment().accounts({ crudapp: crudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.crudapp.fetch(crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Crudapp', async () => {
    await program.methods.decrement().accounts({ crudapp: crudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.crudapp.fetch(crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set crudapp value', async () => {
    await program.methods.set(42).accounts({ crudapp: crudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.crudapp.fetch(crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the crudapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        crudapp: crudappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.crudapp.fetchNullable(crudappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
