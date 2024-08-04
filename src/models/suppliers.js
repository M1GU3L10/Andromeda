const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Supplier = sequelize.define('Supplier', {
    Nombre_Proveedor: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    Unidades: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 0
        }
    },
    Precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    Precio_total: {
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
    },
    Id_Producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products', // Nombre de la tabla a la que hace referencia
            key: 'id'         // Clave primaria en la tabla de productos
        }
    }
}, {
    tableName: 'suppliers'
});

module.exports = Supplier;
