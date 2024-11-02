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
- Unsplash

## Actions and reactions

The project comprises 14 actions and 13 reactions

[Here](https://nexus.leafs-studio.com/about.json) you can find all our actions and reactions integrated with our various services.

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

or 

```bash
./.build.sh
```

This docker command will build all our project's services and put the result on a shared volume for you to launch.

- The second is to launch all the services by hand using NodeJS and NPM. You'll find a detailed description of how to launch the service in each readme of each subfolder. You'll find quick links below

## Documentation

You will find below links to our documentation which are either readme or online documentation of our services.

- [Website and Mobile doc](https://github.com/Tek-Pheed/AREA/blob/master/area/README.md)
- [Website and Mobile technical documentation](https://github.com/Tek-Pheed/AREA/blob/master/docs/nexus_front_doc.pdf)
- [API doc (Readme)](https://github.com/Tek-Pheed/AREA/blob/master/api/README.md)
- [API doc (online)](https://api.leafs-studio.com/docs)
- [Webservice doc](https://github.com/Tek-Pheed/AREA/blob/master/ws/README.md)
- [Webservice technical documentation](https://github.com/Tek-Pheed/AREA/blob/master/docs/nexus_ws_doc.pdf)
- [User guide](https://github.com/Tek-Pheed/AREA/blob/dev/docs/Nexus%20-%20User%20Guide.pdf)

## CI / CD

For the CI / CD we use GitHub Action to get feedback directly in GitHub.

We also have several CIs / CDs for each service.

The pipelines are complete CI/CDs including a build test, unit tests with coverage available in the comments of each commit and some have a deployment action on remote SFTP servers.

Compilations are just a basic build test.

Testing for docker and a test of docker-compose and whether it can be launched.

Finally, the upload code sends the master content to the epitech rendering repo.

- **API - Pipeline**
- **WebService - Pipeline**
- **Website - Pipeline**
- **Android - Pipeline**
- **Docker - Testing**
- **Epitech - Upload code**

But we also use Xcode cloud to compile our iOS app as well as to release a beta.

## Unit testing

This project includes unit tests for webservice and api.

You'll find the commands you need to run them in the documentation.

These unit tests generate coverage.

We have set ourselves a target of 80% coverage for the entire project.

- WS --> 80%
- API --> 95.66%

## Bonus

We have realized several bonuses during this project. You will find the list below:

- Several reactions to one action.
- An ios application.
- A beta of our iOS app each time a new version is released.
- Micro service to execute actions and reactions so that there are no service interruptions if our api or si crashes or slows down.
- Deployment of our api on a server so we can use the mobile app on our phones and not just in a simulator.
- Execution logs of our actions and reactions, so that the user can see if there are any errors.
- Micro service and Web site deployed on a server to find out if our solution works on machines other than ours and to offer our solution to everyone.
- A complete CI / CD on all our services, including build testing, unit testing and production deployment.
- Using Xcode cloud to deploy our Ios beta versions.
- Creation of “labels” to retrieve information about the action executed for the associated reaction.
- When no pair of reaction actions is created, we automatically propose reaction actions.
- We have also integrated the possibility of modifying actions / reactions.


## Author

### Developers: 
- Lucas Loustalot
- Raphael Scandella
- Samy Nasset
- Arnaud Augait
- Alexandre Ricard
