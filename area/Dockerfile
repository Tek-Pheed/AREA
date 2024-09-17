FROM node:20-alpine
VOLUME ["/usr/data"]
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm i

CMD npm run start
EXPOSE 4200