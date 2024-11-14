const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Privilege = require('./privilegios');


const Permission = sequelize.define('Permission', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }
}, {
    tableName: 'permissions'
});

module.exports = Permission;