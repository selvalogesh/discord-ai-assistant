ARG DISCORD_BOT_CLIENT_ID
ARG DISCORD_BOT_TOKEN

FROM node:18-alpine

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install
COPY . /app

CMD npm start
