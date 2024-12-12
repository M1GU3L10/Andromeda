const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Sale = sequelize.define('Sale', {
    Billnumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    SaleDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    registrationDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
    total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Completada', 'Cancelada', 'Pendiente'),
        allowNull: false,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        references: {
            model: User, // Aquí se referencia al modelo User
            key: 'id',
        },
    },
}, {
    tableName: 'sales',
    timestamps: false,
});

module.exports = Sale;
