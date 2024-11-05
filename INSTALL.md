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

- Copy file .env.dist to .env.
- Set correct values in .env file for your environment.

## Configure .env.local in github repository

For adding a new repository secret:

1. Go to needed repository.
2. Click `Settings` in the top right corner of the repository.
3. Next, go to the tab `Secrets and variables` > `Actions`.
4. Add a new repository secret called `NEXT_PUBLIC_`... with the value you need.

For adding a github token:

1. Click `Settings` in the tabs of your github profile
2. In the bottom left corner of the Settings tabs, click `Developer Settings`.
3. In the bottom left corner of the Developer Settings tabs, click `Personal access tokens` > `Tokens (classic)`.
4. Click `Generate new token` > `Generate new token (classic)`.
5. Enter your password.
6. Enter note, select the `repo` scope and in `Expiration` select `No expiration`.
7. Click `Generate token` at the bottom.
8. Copy and paste the generated token into the repository secrets.

For adding firebase settings

1. Create a project in `https://console.firebase.google.com/u/0/`.
2. Name the project.
3. Disable google analytics.
4. Wait for the project to be created.
5. Click the `Web` icon for the registration application.
6. Copy and paste the generated data from firebase config into the secrets repository.
