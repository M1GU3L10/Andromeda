const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de importar la instancia de sequelize correctamente
const User = require('./User'); // Asegúrate de ajustar la ruta al archivo del modelo de usuario
const DetailAppointment = require('./detailAppointment'); // Importa el modelo de detalle de la cita
const Service = require('./service'); // Importa el modelo de servicio (si es necesario)

const Appointment = sequelize.define('Appointment', {
    Init_Time: { // Hora de inicio
        type: DataTypes.TIME,
        allowNull: false
    },
    Finish_Time: { // Hora de finalización
        type: DataTypes.TIME,
        allowNull: false
    },
    Date: { // Fecha de la cita
        type: DataTypes.DATE,
        allowNull: false
    },
    Total: { // Monto total
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    status: {
        type: DataTypes.ENUM('A', 'I'),
        allowNull: false,
        defaultValue: 'A'
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
    },
    empleadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
    },
    serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Service,
            key: 'id'
        },
    }
}, {
    tableName: 'appointments'
});

module.exports = Appointment;
