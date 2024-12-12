const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        },
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
    },
    status: {
        type: DataTypes.ENUM('A', 'I'),
        allowNull: false,
        defaultValue: 'A',
    },
}, {
    tableName: 'services',
    timestamps: false,
});

module.exports = Service;
