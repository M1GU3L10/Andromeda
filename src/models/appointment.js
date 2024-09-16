const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Appointment = sequelize.define('Appointment', {
    Init_Time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    Finish_Time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    Date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Total: {  // Se calculará automáticamente
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    tiempo_de_la_cita: {  // Tiempo calculado de la cita
        type: DataTypes.TIME,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
        allowNull: false,
        defaultValue: 'pendiente'
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    tableName: 'appointments'
});

module.exports = Appointment;
