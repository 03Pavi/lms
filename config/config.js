require("dotenv").config();

module.exports = {
  "development": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "host": process.env.DATABASE_HOST,
    "dialect": "postgres",
    "logging": (message) => console.log(message), 
    "define": {
      "underscored": true,
    },
  },
  "test": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "host": process.env.DATABASE_HOST,
    "dialect": "postgres",
    "logging": false, 
    "define": {
      "underscored": true,
    },
  },
  "production": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "host": process.env.DATABASE_HOST,
    "dialect": "postgres",
    "logging": false, 
    "define": {
      "underscored": true,
    },
  },
};
