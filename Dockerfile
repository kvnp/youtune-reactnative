FROM node:15-alpine

# Patches require that `git` is installed
RUN apk add --no-cache git

WORKDIR /app

ENV HOSTNAME utune.herokuapp.com
ENV NODE_ENV development
ENV PORT 8080

COPY package.json .
COPY . .

RUN npm install
RUN npm start