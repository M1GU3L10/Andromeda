const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./products');
const shopping = require('./shopping');

const ShoppingDetail = sequelize.define('ShoppingDetail', {
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  unitPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
  shopping_id: {
    type: DataTypes.INTEGER,
    references: {
      model: shopping,
      key: 'id',
    },
  },
}, {
  tableName: 'shopping_details',
});

shopping.hasMany(ShoppingDetail, { foreignKey: 'shopping_id' });
ShoppingDetail.belongsTo(shopping, { foreignKey: 'shopping_id' });
Product.hasMany(ShoppingDetail, { foreignKey: 'product_id' });
ShoppingDetail.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = ShoppingDetail;