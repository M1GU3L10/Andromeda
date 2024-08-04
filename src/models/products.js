const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de importar la instancia de sequelize correctamente

const Product = sequelize.define('Product', {
    Nombre_Producto: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    Stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 0
        }
    },
    Precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    Id_categoria_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories', // Nombre de la tabla a la que hace referencia
            key: 'id'            // Clave primaria en la tabla de categorías
        }
    }
}, {
    tableName: 'products'
});

module.exports = Product;
