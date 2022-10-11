# Artiva Platform Client

## Step 1. Creating your platform

First create your platform via [etherscan](https://goerli.etherscan.io/address/0xf347cf551615e9933cf967c8ac4eded7dda6f1d2#writeContract#F3) and copy the contract address once your platform has been deployed.

## Step 2. Clone and deploy with Vercel

Click the '▲ Deploy' button below to clone your own version of the platform client.

You will be prompted to fill a few variables as part of the deployment process.

### Required Variables

`NEXT_PUBLIC_ALCHEMY_KEY` can be found by creating a new project in [Alchemy](https://dashboard.alchemyapi.io/) and then grabbing the API KEY from the project dashboard page and clicking the 'Get Key' button.

`NEXT_PUBLIC_PLATFORM_NETWORK` will be the chain your platform exists on.

```
1 = Ethereum mainnet
5 = Goerli

```

`NEXT_PUBLIC_PLATFORM_ADDRESS` will be your contract address

`ARTIVA_COOKIE_PASSWORD` will be a password to keep login cookies secure for your users. Should be at least 32 characters long.

### Optional Variables

`PINATA_API_JWT` required if pinata is being used as the IPFS adapter in `artiva-client-config.ts`. This is the JWT value for a [Pinata](https://www.pinata.cloud/) admin key.

`NEXT_PUBLIC_ZORA_API_KEY` Zora API key used to increase rate limits for any Zora API calls.

### Deploy

Deploy your platform client using the deploy link below

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fartiva-xyz%2Fplatform-client&env=NEXT_PUBLIC_PLATFORM_ADDRESS,NEXT_PUBLIC_PLATFORM_NETWORK,NEXT_PUBLIC_ALCHEMY_KEY,ARTIVA_COOKIE_PASSWORD)
