// src/models/UserModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que la importación sea directa

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users'
});

module.exports = User;
