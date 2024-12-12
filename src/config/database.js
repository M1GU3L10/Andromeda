const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.PORT, 10), // Changed from DB_PORT to PORT
        dialect: process.env.DB_DIALECT,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        // Add this to increase the connection timeout
        connectTimeout: 60000
    }
);

module.exports = sequelize;