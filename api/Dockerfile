FROM node:20-alpine

USER 0
RUN mkdir /usr/server
RUN mkdir /usr/server/src
RUN mkdir /usr/server/src/ws
RUN mkdir /usr/server/src/ws/logs
USER $CONTAINER_USER_ID
VOLUME  /usr/server/src/ws/logs
VOLUME /usr/server/src/app/output
WORKDIR /usr/server/src/app
COPY . /usr/server/src/app

RUN npm i
RUN npm run doc
RUN npm run build
EXPOSE 8080

CMD npm run start
