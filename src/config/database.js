const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "english_speaking_app",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "root",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    dialect: process.env.DB_DIALECT || "postgres",
    logging: false,
  }
);

module.exports = sequelize;
