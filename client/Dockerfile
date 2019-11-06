FROM node:13-alpine AS build
RUN apk add --update --no-cache python make g++ 
WORKDIR /usr/src/app
COPY src/ /usr/src/app
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install

FROM node:13-alpine
RUN mkdir /app
WORKDIR /app
COPY --from=build /usr/src/app/ .
CMD ["npm", "start"]
