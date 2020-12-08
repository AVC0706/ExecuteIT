FROM node:12-alpine

RUN apk add build-base linux-headers make python2

COPY package.json /server/

WORKDIR /server/

RUN npm i

COPY index.js /server/
COPY config.js /server/

ENTRYPOINT npm start
