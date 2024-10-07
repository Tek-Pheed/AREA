# AREA - WebService

The aim of this service is to run in parallel with the applications so as not to impact them. It constantly monitors whether actions are being taken to execute the reactions linked to the application in the configurations set by the users.

**This service of AREA use exclusively TypeScript**

## Before start ws

Before start ws please create ``.env`` file at the root of ``ws`` folder and add the following lines :

```env
MYSQL_HOST=
MYSQL_USER=
MYSQL_PASSWD=
MYSQL_DATABASE=

TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
TWITCH_REDIRECT_URI=

SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=

DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=

TWITTER_APIKEY=
TWITTER_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=
```

## How do I start it?

You can use the docker compose command [here](https://github.com/Tek-Pheed/AREA/blob/master/README.md).

You can also use these commands at the root of the project:

```bash
cd ws/
npm i
npm run dev
```

The commands you'll execute will place you in the right folder, install the dependencies needed for the **WebService** to function properly, and compile and launch it.
