FROM node:11-alpine AS build
RUN apk add --update --no-cache python make g++
COPY src/ /src
WORKDIR /src
RUN npm ci
RUN npm run format
RUN npm run build
RUN npm run test
RUN npm prune --production

FROM node:11-alpine
WORKDIR /app
COPY --from=build /src/node_modules node_modules
CMD ["node", "/app/server.js"]
