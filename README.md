# AREA - Website and Mobile App

This service is dedicated to the mobile application and the website. These applications allow users to consult, create, modify and delete their action/reaction pairs through an interface.

**It was built entirely in Ionic coupled with Angular using TypeScript**.

## Prerequisites

Before using the project, it is important to run these two commands upstream

```bash
npm i -g @angular/cli
npm i -g @ionic/cli
```

For **linux** users, you will probably need to use administrator rights via **sudo** to run these commands.

## How do I start it?

You can use the docker compose command [here](https://github.com/Tek-Pheed/AREA/blob/master/README.md).

You can also use these commands at the root of the project:

### Web only

```bash
cd area/
npm i
npm run dev
```

The commands you'll execute will place you in the right folder, install the dependencies needed for the **Website** to function properly, and compile and launch it.

### Mobile (Android)

```bash
cd area/
npm i
ionic capacitor build android
```

The commands you'll execute will place you in the right folder, install the dependencies needed for the **Mobile app** to function properly, and compile and launch android studio.