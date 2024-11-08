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

## Website

### For local environment

- Copy file `.env.dist` to `.env`.
- Set correct values in `.env` file for your environment.

### For github repository

#### For adding a new repository secret

1. Go to your GitHub repository.
2. Go to "Settings > Secrets and variables > Actions > Secrets > Repository secrets".
3. Add a new repository secret called `NEXT_PUBLIC_...` with the value you need.

#### For adding GitHub token (optional, checks for application version updates are used)

1. Go to GitHub user menu under your avatar.
1. Go to "Settings > Developer Settings > Personal access tokens > Tokens (classic)".
4. Click "Generate new token > Generate new token (classic)".
5. In `Expiration` select `No expiration`.
6. Select the `repo` scope.
7. Generate token.
8. Copy and paste the generated token into the repository secret using name `NEXT_PUBLIC_GITHUB_TOKEN`.

#### For adding Firebase settings (optional, used for online storage of transactions and signatures)

1. Go to `https://console.firebase.google.com`.
2. Create new project.
3. Disable Google Analytics.
4. Create `Web` app in your project.
5. Copy and paste the generated data from firebase config into repository secrets using names:
  - "apiKey > NEXT_PUBLIC_FIREBASE_API_KEY"
  - "authDomain > NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
  - "projectId > NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  - "storageBucket > NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
  - "messagingSenderId > NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  - "appId > NEXT_PUBLIC_FIREBASE_APP_ID"
