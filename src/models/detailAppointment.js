const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Appointment = require('./appointment'); // Importa el modelo de cita
const Service = require('./service'); // Importa el modelo de servicio

const DetailAppointment = sequelize.define('DetailAppointment', {
    sub_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    tiempo_de_la_cita: {  // Tiempo cita
        type: DataTypes.TIME,
        allowNull: false,
    },
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
}, {
    tableName: 'detailAppointment'
});

// Definir las asociaciones
Appointment.hasMany(DetailAppointment, { foreignKey: 'appointmentId' });
DetailAppointment.belongsTo(Appointment, { foreignKey: 'appointmentId' });
Service.hasMany(DetailAppointment, { foreignKey: 'serviceId' });
DetailAppointment.belongsTo(Service, { foreignKey: 'serviceId' });

module.exports = DetailAppointment;
