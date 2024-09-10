const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Appointment = require('./appointment');
const Service = require('./service');
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

module.exports = DetailAppointment;
