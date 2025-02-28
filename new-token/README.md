# Tokens


Open the Command Line

1. Make a Token Mint Authority
There account in charge of making new tokens from a mint account
    - Create a Keypair that matches a criteria
    ```bash
    solana-keygen grint --start-with bos:1
    ```

    - Set the Newly created Key pair as the default keypair for your solana config
    ```bash
    solana config set --keypair bos*******
    ```

    - Ensure the solana config is using the Devnet cluster since this is where we would get our tokens from
    ```bash
    solana config set -ud
    ```

2. Create Mint
    - Create Keypair for the Mint Account
    ```bash
    solana-keygen grind --starts-with mnt:1
    ```
    - Create a Token Mint and put the address generated above
    ```bash
    spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata mnt***
    ```

3. Create Mint Metadata Json file
    ```json
    {
        "name": "Batman Token",
        "symbol": "BTM",
        "description": "Batman token for Solana Foundation Bootcamp",
        "image": "https://walkoffame.com/wp-content/uploads/2024/09/RebirthBM_mod-1-scaled-e1726522940368.jpg"
    }
    ```
4. Initialize Metadata for the Token Mint
    ```bash
    spl-token initialize-metadata mntWGnL4t8Lumk58YgMmRQ9mdkQJ3Z7dktsKim81jbC 'BATMAN' 'BTM' https://raw.githubusercontent.com/brianobot/solana-developer-bootcamp-2024/refs/heads/master/new-token/metadata.json
    ```

5. Mint Some Token to an Account
    - Create a Token Account to hold the token
        ```bash
        spl-token create-account mnt***
        ```

    - Mint Token to the Token Account   
        ```bash
        spl-token mint 1000
        ```