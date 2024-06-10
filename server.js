require("dotenv").config();
global.argv = process.argv.slice(2);
global.port = global.argv[0] || process.env.APP_PORT;

if (!global.port) {
  console.log("port is not defined. argv = ", global.argv);
  process.exit(128);
}

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// DB Connection
require("./config/db_connection").check_db_connection();

// Routes declaration
app.use('/', require('./routes'));
app.use(function (req, res) {
  res.status(404).json({ error: 'Unable to find the requested resource!' });
});

app.listen(global.port, () => {
  const NODE_ENV = process.env.NODE_ENV;
  console.clear();
  console.log(`${NODE_ENV} Server is listening on port ${global.port}`);
});

module.exports = app;