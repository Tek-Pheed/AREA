# {E} - AREA

This project consists in creating a website and a mobile application in order to combine pairs of actions and reactions on different APIs such as Spotify, Twitch, etc...

For this project, we have chosen the following languages and framework :

- TypeScript for all services
- Express with TS for the backend
- Ionic with Angular for the web and mobile service

For this project, we have chosen the following list of APIs:

- Twitch
- Spotify
- Google Calendar
- Github
- Discord

## Project architecture

Our project is composed of 4 distinct services:

- The website for creating actions / reactions
- The mobile app that does the same thing, compatible with IOS and Android
- The api we developed to secure exchanges with our database
- Our webservice, which executes the actions/reactions in parallel.

## How to launch the project?

There are two ways to launch our project:

- The first is to clone this repo and then launch the docker-compose with the following command:

```bash
docker-compose up --force-recreate --no-deps --build
```

This docker command will build all our project's services and put the result on a shared volume for you to launch.

- The second is to launch all the services by hand using NodeJS and NPM. You'll find a detailed description of how to launch the service in each readme of each subfolder. You'll find quick links below

## Documentation

You will find below links to our documentation which are either readme or online documentation of our services.

- [Website and Mobile doc](https://github.com/Tek-Pheed/AREA/blob/master/area/README.md)
- [API doc (Readme)](https://github.com/Tek-Pheed/AREA/blob/master/api/README.md)
- [API doc (online)](https://api.leafs-studio.com/docs)
- [Webservice doc](https://github.com/Tek-Pheed/AREA/blob/master/area/ws/README.md)

## CI / CD

We also have several CIs / CDs for each service.

The pipelines are complete CI/CDs including a build test, unit tests with coverage available in the comments of each commit and some have a deployment action on remote SFTP servers.

Compilations are just a basic build test.

Testing for docker and a test of docker-compose and whether it can be launched.

Finally, the upload code sends the master content to the epitech rendering repo.

- **API - Pipeline**
- **WebService - Pipeline**
- **Website - Pipeline**
- **Mobile - Compilation**
- **Docker - Testing**
- **Epitech - Upload code**

# Unit testing

This project includes unit tests for each service.

You'll find the commands you need to run them in the documentation.

These unit tests generate coverage.

We have set ourselves a target of 80% coverage for the entire project.

## Author

### Developers: 
- Lucas Loustalot
- Raphael Scandella
- Samy Nasset
- Arnaud Augait
- Alexandre Ricard
