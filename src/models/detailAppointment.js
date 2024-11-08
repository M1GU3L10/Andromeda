const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Appointment = require('./appointment');
const Service = require('./service');
const Product = require('./products');
const Sale = require('./sale');
const User = require('./User'); // Importa el modelo de usuario (empleado)

const DetailAppointment = sequelize.define('DetailAppointment', {
    appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Appointment,
            key: 'id'
        }
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Product,
          key: 'id',
        },
      },
      id_sale: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Sale,
          key: 'id',
        },
      },
    serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Service,
            key: 'id'
        }
    },
    empleadoId: {  // Empleado que realiza el servicio
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    tableName: 'detailAppointment'
});

// Definir las asociaciones
Appointment.hasMany(DetailAppointment, { foreignKey: 'appointmentId' });
DetailAppointment.belongsTo(Appointment, { foreignKey: 'appointmentId' });
Service.hasMany(DetailAppointment, { foreignKey: 'serviceId' });
DetailAppointment.belongsTo(Service, { foreignKey: 'serviceId' });
User.hasMany(DetailAppointment, { foreignKey: 'empleadoId' });
DetailAppointment.belongsTo(User, { foreignKey: 'empleadoId' });

// Definir las asociaciones para venta
Sale.hasMany(DetailAppointment, { foreignKey: 'id_sale' });
DetailAppointment.belongsTo(Sale, { foreignKey: 'id_sale' });
Product.hasMany(DetailAppointment, { foreignKey: 'id_producto' });
DetailAppointment.belongsTo(Product, { foreignKey: 'id_producto' });

module.exports = DetailAppointment;