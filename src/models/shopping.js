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
    },
    total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
    status: {
        type: DataTypes.ENUM('anulada', 'completada'),
        allowNull: false,
        validate: {
            isIn: [['anulada', 'completada']]
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
    timestamps: true,
    hooks: {
        beforeCreate: (shopping, options) => {
            shopping.registrationDate = new Date().toISOString().split('T')[0];
        },
    },
});

Shopping.belongsTo(Supplier, { foreignKey: 'supplierId' });
Supplier.hasMany(Shopping, { foreignKey: 'supplierId' });

module.exports = Shopping;