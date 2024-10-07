FROM node:20-alpine
USER root
VOLUME /usr/src/app/src/assets/output
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm i
RUN npm install -g @ionic/cli

EXPOSE 4200
CMD ionic serve --external --host="0.0.0.0" --port="4200"
