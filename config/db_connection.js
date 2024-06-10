const { Sequelize } = require("sequelize");
const config = require("./config")[process.env.NODE_ENV];

const sequelize = new Sequelize(config);

const check_db_connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};


module.exports = {
  sequelize,
  check_db_connection,
};
