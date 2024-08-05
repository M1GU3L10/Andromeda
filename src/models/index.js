const sequelize = require('../config/database');
const Category = require('./category');
const Service = require('./service');
const User = require('./User');
const Role = require('./role');
const Shopping = require('./shopping');
const absence = require('./absence');
const programming = require('./programmingEmployee');
const appointmen = require('./appointment');

const models = {
    Category,
    Service,
    User,
    Role,
    Shopping,
    absence,
    programming,
    appointmen
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