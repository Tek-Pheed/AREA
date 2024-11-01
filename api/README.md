# AREA - API

The aim of the api is to secure access to the database through specific endpoints called in the mobile app and website.

**This service of AREA use exclusively TypeScript and work with MySQL Database**

## Before start api

Before start api please create ``.env`` file at the root of ``api`` folder and add the following lines :

```env
MYSQL_HOST=
MYSQL_USER=
MYSQL_PASSWD=
MYSQL_DATABASE=
SECRET=
API_PORT=8080
LOG_FILE=
WEB_HOST=

TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
TWITCH_REDIRECT_URI=

SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=

DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

UNSPLASH_CLIENT_ID=
UNSPLASH_CLIENT_SECRET=
UNSPLASH_REDIRECT_URI=
```

## How do I start it?

You can use the docker compose command [here](https://github.com/Tek-Pheed/AREA/blob/master/README.md).

You can also use these commands at the root of the project:

```bash
cd api/
npm i
npm run dev
```

The commands you'll execute will place you in the right folder, install the dependencies needed for the **API** to function properly, create documentation, compile and launch it.

## Units tests and coverage

You can run units tests with coverage with the following commands :

```bash
cd api/
npm test
```

This commands you'll execute units tests and generate coverage in coverage folder.

# Documentation

You can find [here](https://api.leafs-studio.com/docs) documentation for each API route, as well as data models and prerequisites for each route.
