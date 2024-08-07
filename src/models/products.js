const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./category');

const Product = sequelize.define('Product', {
    Product_Name: {
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
    Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    Category_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category, // Nombre de la tabla a la que hace referencia
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    Image: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    }
}, {
    tableName: 'products'
});


module.exports = Product;
