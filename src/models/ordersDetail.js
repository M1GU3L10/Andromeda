const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./products');
const Order = require('./orders');

const OrderDetail = sequelize.define('OrderDetail', {
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
  id_producto: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
  id_order: {
    type: DataTypes.INTEGER,
    references: {
      model: Order,
      key: 'id',
    },
  },
}, {
  tableName: 'order_details',
});

Order.hasMany(OrderDetail, { foreignKey: 'id_order' });
OrderDetail.belongsTo(Order, { foreignKey: 'id_order' });
Product.hasMany(OrderDetail, { foreignKey: 'id_producto' });
OrderDetail.belongsTo(Product, { foreignKey: 'id_producto' });

module.exports = OrderDetail;
