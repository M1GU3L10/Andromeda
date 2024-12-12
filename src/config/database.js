const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.PORT, 10), // Use PORT from .env, parsed as integer
        dialect: process.env.DB_DIALECT, // Use DB_DIALECT from .env
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            ssl: {
                rejectUnauthorized: true,
            }
        }
    }
);

module.exports = sequelize;