const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Make sure to import the sequelize instance correctly

const Product = sequelize.define('Product', {
    Product_Name: { // Nombre del producto
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    Stock: { // Cantidad en inventario
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 0
        }
    },
    Price: { // Precio del producto
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    Category_Id: { // Identificador de la categoría del producto
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories', // Name of the table it references
            key: 'id'            // Primary key in the Categories table
        }
    }
}, {
    tableName: 'products'
});

module.exports = Product;
