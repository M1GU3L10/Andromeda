const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Supplier = sequelize.define('Supplier', {
    Supplier_Name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Phone_Number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },   
    status: {
        type: DataTypes.ENUM('A', 'I'),
        allowNull: false,
        defaultValue: 'A'
    }

}, {
    tableName: 'suppliers',
    timestamps: true, 
});

module.exports = Supplier;
