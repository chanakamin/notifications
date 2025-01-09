# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=20.10.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV development
ENV PORT 8080
ENV AUTH_TOKEN onlyvim2024
ENV NOTIFICATION_URL http://host.docker.internal:5001


WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install


# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci --omit=dev
RUN chown -R node:node /usr/src/app

USER node

COPY . .

# Expose the port that the application listens on.
EXPOSE 8080

# Run the application.
CMD ["npm", "run", "dev"]