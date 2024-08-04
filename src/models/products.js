const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de importar la instancia de sequelize correctamente

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
            model: 'Categories', // Nombre de la tabla a la que hace referencia
            key: 'id'            // Clave primaria en la tabla de categorías
        },
        onUpdate: 'CASCADE', // Opcional: Actualiza las referencias si se cambia la clave primaria en la tabla de categorías
        onDelete: 'RESTRICT' // Opcional: Restringe la eliminación si hay productos asociados
    }
}, {
    tableName: 'products'
});

module.exports = Product;
