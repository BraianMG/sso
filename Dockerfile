# Development stage
FROM node:20-alpine as development
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY tsconfig.json tsconfig.build.json ./
COPY ./src ./src
CMD [ "yarn", "start:dev" ]

# Builder stage
FROM development as builder
WORKDIR /usr/src/app
# Build the app with devDependencies still installed from "development" stage
RUN yarn build
# Clear dependencies and reinstall for production (no devDependencies)
RUN rm -rf node_modules
RUN yarn --production


# Production stage
FROM node:20-alpine as production
RUN apk --no-cache add nodejs ca-certificates
WORKDIR /root/
COPY --from=builder /usr/src/app ./
CMD [ "yarn", "start:prod" ]