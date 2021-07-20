FROM node:15-alpine

RUN apk add --no-cache git

WORKDIR /app

ENV NODE_ENV development
ENV PORT 8080

COPY package.json .
COPY package-lock.json .
COPY . .

RUN npm install

CMD ["npm", "run", "web"]