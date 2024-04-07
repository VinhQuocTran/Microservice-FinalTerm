// Import Sequelize
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});

// Define the database connection details
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST, // or your host
    port: process.env.DB_PORT,
    dialect: 'mysql',
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Export the sequelize instance
module.exports = sequelize;
