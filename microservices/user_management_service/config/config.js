require('dotenv').config();

console.log(process.env.DB_HOSTNAME);

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    migrationStorageTableName: "migrations"
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    migrationStorageTableName: "migrations"
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    migrationStorageTableName: "migrations"
  }
};