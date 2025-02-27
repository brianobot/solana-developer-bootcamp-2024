// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import CrudappIDL from '../target/idl/crudapp.json'
import type { Crudapp } from '../target/types/crudapp'

// Re-export the generated IDL and type
export { Crudapp, CrudappIDL }

// The programId is imported from the program IDL.
export const CRUDAPP_PROGRAM_ID = new PublicKey(CrudappIDL.address)

// This is a helper function to get the Crudapp Anchor program.
export function getCrudappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...CrudappIDL, address: address ? address.toBase58() : CrudappIDL.address } as Crudapp, provider)
}

// This is a helper function to get the program ID for the Crudapp program depending on the cluster.
export function getCrudappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Crudapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return CRUDAPP_PROGRAM_ID
  }
}
