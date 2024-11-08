const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./products');
const Sale = require('./sale');
const Appointment = require('./appointment');
const Service = require('./service');
const User = require('./User'); // Importa el modelo de usuario (empleado)

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
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Service,
      key: 'id'
    }
  },
  empleadoId: {  // Empleado que realiza el servicio
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  id_sale: {
    type: DataTypes.INTEGER,
    references: {
      model: Sale,
      key: 'id',
    },
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Appointment,
      key: 'id'
    }
  },
}, {
  tableName: 'sale_details',
});

Sale.hasMany(SaleDetail, { foreignKey: 'id_sale' });
SaleDetail.belongsTo(Sale, { foreignKey: 'id_sale' });
Product.hasMany(SaleDetail, { foreignKey: 'id_producto' });
SaleDetail.belongsTo(Product, { foreignKey: 'id_producto' });
Appointment.hasMany(SaleDetail, { foreignKey: 'appointmentId' });
SaleDetail.belongsTo(Appointment, { foreignKey: 'appointmentId' });
Service.hasMany(SaleDetail, { foreignKey: 'serviceId' });
SaleDetail.belongsTo(Service, { foreignKey: 'serviceId' });
User.hasMany(SaleDetail, { foreignKey: 'empleadoId' });
SaleDetail.belongsTo(User, { foreignKey: 'empleadoId' });

module.exports = SaleDetail;
