FROM node:11-alpine AS build
RUN apk add --update --no-cache python make g++ 
WORKDIR /usr/src/app
COPY src/ /usr/src/app
RUN npm install

FROM node:11-alpine
RUN mkdir /app
WORKDIR /app
COPY --from=build /usr/src/app/node_modules node_modules
CMD ["npm", "start"]
