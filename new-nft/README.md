NFT are just like Regular Tokens but with some special abilities
- A NFT is gotten from a Mint Account just like normal SPL Tokens but an NFT can only have a supply of 1
- A NFT does not have decimal place since each unit is a whole

## Installation
- install the following npm packages inorder to interact with Metaplex
  ```bash
  npm i @metaplex-foundation/mpl-token-metadata @metaplex-foundation/umi-bundle-defaults
  ```

### Create Collection
Since Every NFT has it own Mint Address, Collection is a way to bid different NFTs together,
Now NFTs from the same collection owner are assured to be of the same origin

- Create a New file called create-collection.ts
```bash
touch create-collection.ts
```

NOTE: Collection themselves are also NFTs