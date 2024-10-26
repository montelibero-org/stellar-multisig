# Installation

Please read through our [Contributing Guidelines](CONTRIBUTING.md).

## General setup

Before you start, install dependencies:

```
npm install
```

Start development server:

```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The website can be accessed at http://localhost:3000.

In case you need to update dependencies:

```
npm update
```

## Configure .env.local

### For firebase

NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_APP_ID=
NEXT_PUBLIC_AUTH_DOMAIN=
NEXT_PUBLIC_MEASUREMENT_ID=
NEXT_PUBLIC_MESSAGING_SENDER_ID=
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_STORAGE_BUCKET=

### To check a version

NEXT_PUBLIC_GITHUB_TOKEN=

## Configure .env.local in github repository

1. Click `Settings` in the top right corner of the repository.
2. Next, go to the tab `Secrets and variables` > `Actions`.
3. Add a new repository secret called `NEXT_PUBLIC_`... with the value you need.
