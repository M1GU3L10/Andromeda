const sequelize = require('../config/database');
const Category = require('./category');
const Service = require('./service')
const User = require('./UserModel')


const models = {
    Category,
    Service,
    User
};

const connectDb = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Base de datos sincronizada exitosamente.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

module.exports = { models, connectDb };