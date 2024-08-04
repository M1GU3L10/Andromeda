const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de importar la instancia de sequelize correctamente

const Supplier = sequelize.define('Supplier', {
    Supplier_Name: { // Nombre del proveedor
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    Units: { // Unidades suministradas
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 0
        }
    },
    Unit_Price: { // Precio por unidad
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    Total_Price: { // Precio total
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    Category_Product_Id: { // Identificador de la categoría del producto
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories', // Nombre de la tabla a la que hace referencia
            key: 'id'            // Clave primaria en la tabla de categorías
        },
        onUpdate: 'CASCADE', // Opcional: Actualiza las referencias si se cambia la clave primaria en la tabla de categorías
        onDelete: 'RESTRICT' // Opcional: Restringe la eliminación si hay proveedores asociados
    },
    Product_Id: { // Identificador del producto suministrado
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products', // Nombre de la tabla a la que hace referencia
            key: 'id'         // Clave primaria en la tabla de productos
        },
        onUpdate: 'CASCADE', // Opcional: Actualiza las referencias si se cambia la clave primaria en la tabla de productos
        onDelete: 'RESTRICT' // Opcional: Restringe la eliminación si hay proveedores asociados
    }
}, {
    tableName: 'suppliers'
});

module.exports = Supplier;
