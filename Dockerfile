FROM node:20.13.1-alpine3.20

ENV PROJECT_DIR=/app

WORKDIR $PROJECT_DIR

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]

