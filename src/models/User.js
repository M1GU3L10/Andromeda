const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role'); // Asegúrate de ajustar la ruta al archivo del modelo de proveedor
const { models } = require('.');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM('A', 'I'),
        allowNull: false,
        defaultValue: 'A'
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'id'
        },
       
    }
}, {
    tableName: 'users'
});

module.exports = User;
