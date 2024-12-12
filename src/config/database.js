const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la conexión a la base de datos usando variables de entorno
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10), // Convierte el puerto a número entero
        dialect: process.env.DB_DIALECT,
        logging: false, // Desactiva los logs de Sequelize
        pool: {
            max: 5, // Máximo número de conexiones en el pool
            min: 0, // Mínimo número de conexiones en el pool
            acquire: 30000, // Tiempo máximo de espera para adquirir una conexión
            idle: 10000, // Tiempo máximo de inactividad de una conexión antes de cerrarla
        },
        // Opciones específicas para el dialecto (en este caso, SSL)
        dialectOptions: {
            ssl: true,
            rejectUnauthorized: false,
        },
    }
);

module.exports = sequelize;