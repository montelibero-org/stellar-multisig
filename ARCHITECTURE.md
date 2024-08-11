# Architecture

## Configs

- [`/src/shared/configs/trusted-mtl-assets.json`](/src/shared/configs/trusted-mtl-assets.json) - Assets array for `/assets` page.
  - `code` - The asset code. This is one of two key pieces of information that identify your token. Without it, your token cannot be listed anywhere.
  - `issuer` - The Stellar public key of the issuing account. This is the second key piece of information that identifies your token. Without it, your token cannot be listed anywhere.
  - `tag` - The tag that is used to group and search for entries on the page.
- [`/src/shared/configs/data-keys.json`](/src/shared/configs/data-keys.json) - Keys ​​for `DATA ENTRIES` that will be automatically decoded.
  - `accounts` - Stellar accounts are shown on the site as links.
  - `links` - Links to another services.
  - `names` - Names and titles.
- [`/src/shared/configs/cache-config.json`](/src/shared/configs/cache-config.json) - Parameters for caching data received from Stellar Network.
