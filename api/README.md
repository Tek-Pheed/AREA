# AREA - API

The aim of the api is to secure access to the database through specific endpoints called in the mobile app and website.

**This service of AREA use exclusively TypeScript and work with MySQL Database**

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