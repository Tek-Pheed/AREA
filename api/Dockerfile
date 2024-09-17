FROM node:20-alpine

WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm i
RUN npm run build

CMD npm run start
EXPOSE 3000