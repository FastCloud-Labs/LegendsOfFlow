# Legends of Flow
Play your moments. Gamifying dapper digital collectables

https://legendsofflow.web.app/

## Project setup

```
# yarn
yarn

# npm
npm install

# pnpm
pnpm install
```

### Compiles and hot-reloads for development

```
# yarn
yarn dev

# npm
npm run dev

# pnpm
pnpm dev
```

### Compiles and minifies for production

```
# yarn
yarn build

# npm
npm run build

# pnpm
pnpm build
```

### Customize configuration

## Deploy

** merging inot "production" branch will automatically trigger a github action to deploy to firebase **

### Using Firebase

`firebase login`

Initiate your project
Run this command from your app's root directory:

`firebase init`

When you're ready, deploy your web app
Put your static files (e.g., HTML, CSS, JS) in your app's deploy directory (the default is "dist"). Then, run this
command from your app's root directory:

`npm run build`
`firebase deploy`

** Production envs are stored in github secrets and deployed as part of action workflow when "production" branch is merged **

After deploying, view your app at https://legendsofflow.web.app

## firebase serverless functions

#### Location:

/functions/index.js

#### Test locally using emulator

`firebase emulators:start`

### Deploying functions

`firebase deploy --only functions`

