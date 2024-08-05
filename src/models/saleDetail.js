const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./products');
const Sale = require('./sale');

const SaleDetail = sequelize.define('SaleDetail', {
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
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  id_producto: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
  id_sale: {
    type: DataTypes.INTEGER,
    references: {
      model: Sale,
      key: 'id',
    },
  },
}, {
  tableName: 'sale_details',
});

Sale.hasMany(SaleDetail, { foreignKey: 'id_sale' });
SaleDetail.belongsTo(Sale, { foreignKey: 'id_sale' });
Product.hasMany(SaleDetail, { foreignKey: 'id_producto' });
SaleDetail.belongsTo(Product, { foreignKey: 'id_producto' });

module.exports = SaleDetail;
