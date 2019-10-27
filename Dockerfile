FROM node:11-alpine AS build
RUN apk add --update --no-cache \
    python \
    make \
    g++
COPY . /src
WORKDIR /src
RUN npm ci
RUN npm run format
RUN npm run build
RUN npm run test
RUN npm prune --production
FROM node:11.10.0-alpine
EXPOSE 1234
WORKDIR /usr/src/service
COPY --from=build /src/node_modules node_modules

COPY --from=build /src/dist distUSER nodeCMD ["node", "./dist/server/index.js"]

# The instructions for the first stage
FROM node:11-alpine as builder

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
RUN apk --no-cache add python make g++
COPY package*.json ./
RUN npm install

# The instructions for second stage
FROM node:11-alpine

WORKDIR /usr/src/app
COPY --from=builder node_modules node_modules
COPY . .
CMD [ "npm", “run”, "start:prod" ]
