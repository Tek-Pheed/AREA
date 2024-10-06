FROM node:20-alpine

VOLUME /output
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm i
RUN npm run build
EXPOSE 3000

CMD npm run start