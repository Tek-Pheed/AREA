FROM node:20-alpine

VOLUME /output
VOLUME /usr/src/app/logs
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm i
RUN npm run build

CMD npm run start