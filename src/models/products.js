const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  Product_Name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  Category_Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Image: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  Stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,  // Inicialmente el stock es 0
  },
  status: {
    type: DataTypes.ENUM('A', 'I'),
    allowNull: false,
    defaultValue: 'A'
  }
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;
