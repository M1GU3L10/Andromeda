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
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
    status: {
        type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
        allowNull: false,
        validate: {
            isIn: [['pendiente', 'completada', 'cancelada']]
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