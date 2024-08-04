const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Supplier = require('./supplier'); // Asegúrate de ajustar la ruta al archivo del modelo de proveedor
const { models } = require('.');

const Shopping = sequelize.define('Shopping', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
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

Shopping.associate=(models)=>{
Shopping.belongsTo(models.supplier, {
    foreignKey: 'supplier_id',
    as:'supplier'
})
}


// Definir la relación con el modelo Supplier
Shopping.belongsTo(Supplier, { foreignKey: 'supplierId' });
Supplier.hasMany(Shopping, { foreignKey: 'supplierId' });

module.exports = Shopping;