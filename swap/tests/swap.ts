import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Swap } from "../target/types/swap";
import { Account, ASSOCIATED_TOKEN_PROGRAM_ID, createMint, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN } from "bn.js";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { confirmTransaction } from "@solana-developers/helpers";
import { randomBytes } from 'node:crypto';


describe("swap", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Swap as Program<Swap>;
  const connection: Connection = provider.connection;

  let maker = anchor.web3.Keypair.generate();
  let taker = anchor.web3.Keypair.generate();

  let tokenMintA: PublicKey;
  let tokenMintB: PublicKey;

  let makerTokenAccountA: Account;
  let takerTokenAccountB: Account;

  let offer: PublicKey;
  let offerBump: Number;
  let vault: PublicKey;
  let vaultBump: Number;

  const arg_id = new BN(randomBytes(8));

  before(async () => {
    await airdrop(connection, maker.publicKey, 10);
    await airdrop(connection, taker.publicKey, 10);

    [offer, offerBump] = PublicKey.findProgramAddressSync([
        Buffer.from("offer"),
        maker.publicKey.toBuffer(),
        arg_id.toArrayLike(Buffer, "le", 8),
    ], program.programId);
    console.log("✅ Offer PDA Acccount Address: ", offer);

    // [vault, vaultBump] = PublicKey.findProgramAddressSync([

    // ]);

    tokenMintA = await createMint(
        connection,
        maker,
        maker.publicKey,
        null,
        6,   
    );
    console.log("✅ Token Mint A: ", tokenMintA);
    
    tokenMintB = await createMint(
        connection,
        taker,
        taker.publicKey,
        null,
        6,
    );
    console.log("✅ Token Mint B: ", tokenMintB);

    makerTokenAccountA = await getOrCreateAssociatedTokenAccount(
        connection,
        maker,
        tokenMintA,
        maker.publicKey,
    );
    console.log("✅ Maker Token Account A", makerTokenAccountA);
    
    takerTokenAccountB = await getOrCreateAssociatedTokenAccount(
        connection,
        taker,
        tokenMintB,
        taker.publicKey,
    );
    console.log("✅ Taker Token Account B", takerTokenAccountB);

    await mintTo(
        connection,
        maker,
        tokenMintA,
        makerTokenAccountA.address,
        maker,
        1000,
    );
    console.log("✅ Minted 1000 Token to Maker Token Account A");
    
    await mintTo(
        connection,
        taker,
        tokenMintB,
        takerTokenAccountB.address,
        taker,
        1000,
    );
    console.log("✅ Minted 1000 Token to Maker Token Account A");

  });

  it("Make Offer is Created!", async () => {
    const tx = await program.methods.make(
        arg_id,
        new BN(10),
        new BN(20),
    )
    .accountsPartial({
        maker: maker.publicKey,
        tokenMintA: tokenMintA,
        tokenMintB: tokenMintB,
        offer: offer,
        makerTokenAccountA: makerTokenAccountA.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .signers([maker])
    .rpc();

    console.log("Your transaction signature", tx);
  });
  
  it("Take Offer is Completed!", async () => {
    const tx = await program.methods.take()
    .accountsPartial({
        taker: taker.publicKey,
        maker: maker.publicKey,
        tokenMintA: tokenMintA,
        tokenMintB: tokenMintB,
        offer: offer,
        takerTokenAccountB: takerTokenAccountB.address,
        vault: vault,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .signers([taker])
    .rpc();

    console.log("Your transaction signature", tx);
  });
});


async function airdrop(connection, address: PublicKey, amount: number) {
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