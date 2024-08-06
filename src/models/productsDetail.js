const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./products');

const DetailProduct = sequelize.define('DetailProducts', {
  registrationTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  registrationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
}, {
  tableName: 'DetailProducts',
});

Product.hasMany(DetailProduct, { foreignKey: 'productId' });
DetailProduct.belongsTo(Product, { foreignKey: 'productId' });

module.exports = DetailProduct;