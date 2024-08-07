const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Supplier = require('./suppliers');

const Shopping = sequelize.define('Shopping', {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    purchaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
            isDate: true
        }
    },
    registrationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
            isDate: true
        }
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notEmpty: true,
            isDecimal: true
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'canceled'),
        allowNull: false,
        validate: {
            isIn: [['pending', 'completed', 'canceled']]
        }
    },
    supplierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Supplier,
            key: 'id'
        },
        validate: {
            notEmpty: true
        }
    }
}, {
    tableName: 'shopping',
    timestamps: true
});

Shopping.belongsTo(Supplier, { foreignKey: 'supplierId' });
Supplier.hasMany(Shopping, { foreignKey: 'supplierId' });

module.exports = Shopping;