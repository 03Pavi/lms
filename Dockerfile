FROM node:20.13.1-alpine3.20

ENV PROJECT_DIR=/app

# Set the working directory
WORKDIR $PROJECT_DIR

RUN mkdir -p /cache
RUN chown -R node /cache
RUN npm config set cache /cache --global

# Copy package.json and package-lock.json
COPY ./package*.json ./

# Install dependencies
RUN npm install --only=prod

# Copy the rest of the application code
COPY --chown=node:node . .