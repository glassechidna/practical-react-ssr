# Practical React SSR Template

A React, React SSR, Redux, React Router, Express (API) and Sequelize (PostgreSQL) template for real-world applications.

## What's included?

We're attempting to avoid being _too_ opinionated, however we're providing a fairly feature-complete starting point
compared to some other React templates, so we've definitely taken some liberty to do things in a particular fashion.

### Core functionality

* React v16
* React server-side rendering
* Redux (state management) - server and client
* React Router v4
* Express API (i.e. REST-like web services)
* Webpack v4
* Hot module reloading (browser _and server_)
* Babel v7 (next) i.e. ES7 support
* Flow (static type checking)
* CSS module & JSS support
* PostgreSQL integration (Sequelize)
* Support for database migrations and seeds
* Authentication (Passport, Bcrypt and cookie-session)
* Console/REPL

### Example (quick start) features

* Simple `User` ORM model
* `/login` end-point 
* Redux actions, reducers for logging in
* Bare bones React components necessary to login

### What's not included?

* Much documentation.

This isn't intended as a "learning template", it's designed to get a practical React SSR project up and running quickly.

There is a reasonable amount of _by example_ code (surrounding the login flow), however you should refer to third-party
documentation whenever you want to do something that hasn't already been demonstrated.

## Setup

### External dependencies

You must have PostgreSQL installed on your system.

In the case of a macOS development machine, PostgreSQL can be installed trivially from Homebrew with:

```
brew install postgres
```


### Install node dependencies

```
yarn
```

### Database initialization

Create a `.env` file and add `DATABASE_URL` in the form of:

```
DATABASE_URL=postgres://<USER>:<USER>@localhost:5432/<YOUR_DB_NAME>
```

Then create and seed the database:

```
yarn run sequelize db:create
yarn run sequelize db:migrate
```

### Seeding the database

```
yarn run sequelize db:seed:all
```

This will create a demo user for you with the credentials:

Username: `admin@localhost`
Password: `practicalSSR`

The seed files can be found at `src/server/db/seeds`. You'll obviously want to at the very least change (or delete)
the seed user's credentials before deploying anything to production.

## Build / Execution

### Run/Debug

```
yarn debug
```

You may now open your browser to `http://localhost:8080` and proceed to login, assuming you've seeded the database or
created a user from the console.

### Build

To build a production bundle:

```
yarn build
```

### Execution

To run in production:

```
yarn start
```

Keep in mind that we've provided a `.env.development`, but not a `.env.production`. You'll need to configure environment variables yourself using `.env.development` as reference.

### Analyze browser bundle size

Thanks to [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) you can view a treemap
of which modules (and source code) are contributing most to the generated bundle's file size.

```
yarn analyze
```

## Debug

Hot module reloading is always enabled in the browser when debugging, however you can optionally debug with or without
server-side debugging.

Server-side hot module reloading results in the server being restarted when changes are made, as such it isn't always
desirable as the server restarts can slow-down development and tend to mess with debug break-points.

### Browser hot module reloading

```
yarn debug
```

### Server (and browser) hot module reloading

```
yarn debug-hot
```

### Production server with browser hot module reloading

```
yarn start-hot
```

## Console / REPL

A console is provided where ORM models are automatically loaded.

```
yarn console
```
