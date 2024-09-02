const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que la configuración de la base de datos esté correcta
const Category = require('./category'); // Asegúrate de que este archivo exporta el modelo Category

const Product = sequelize.define('Product', {
    Product_Name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true // Asegura que el nombre del producto no esté vacío
        }
    },
    Stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true, // Asegura que el stock es un número entero
            min: 0 // Asegura que el stock no sea negativo
        }
    },
    Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true, // Asegura que el precio es un decimal
            min: 0 // Asegura que el precio no sea negativo
        }
    },
    Category_Id: {
        type: DataTypes.INTEGER,    
        allowNull: false,
        references: {
            model: Category, // Asegúrate de que el modelo Category está definido y exportado
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    Image: {
        type: DataTypes.BLOB('long'), // Cambiado a BLOB para almacenar archivos de imagen
        allowNull: true
    },
  
}, {
    tableName: 'products' // Asegura que Sequelize use el nombre de tabla especificado
});

module.exports = Product;

