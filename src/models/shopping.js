const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Supplier = require('./suppliers');

const Shopping = sequelize.define('Shopping', {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    purchaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    registrationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'canceled'),
        allowNull: false,
    },
    supplierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Supplier,
            key: 'id'
        },
       
    }
}, {
    tableName: 'shopping',
    timestamps: true // Configura a true si deseas usar timestamps (createdAt, updatedAt)
});



// Definir la relación con el modelo Supplier
Shopping.belongsTo(Supplier, { foreignKey: 'supplierId' });
Supplier.hasMany(Shopping, { foreignKey: 'supplierId' });

module.exports = Shopping;
