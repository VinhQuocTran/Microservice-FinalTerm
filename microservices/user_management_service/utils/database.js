const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOSTNAME,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
    }
);

sequelize
    .authenticate()
    .then(() => console.log('Database connect successful'))
    .catch((err) => console.log('Error when connect to database', err));

module.exports = sequelize;