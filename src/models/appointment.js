const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de importar la instancia de sequelize correctamente

const Appointment = sequelize.define('Appointment', {
    Init_Time: { // Hora de registro
        type: DataTypes.TIME,
        allowNull: false
    },
    Finish_Time: { // Hora de registro
        type: DataTypes.TIME,
        allowNull: false
    },
    Date: { // Fecha del pedido
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
    Client_Id: { // Identificador de la categoría del producto
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Nombre de la tabla a la que hace referencia
            key: 'id'            // Clave primaria en la tabla de categorías
        },
        onUpdate: 'CASCADE', // Opcional: Actualiza las referencias si se cambia la clave primaria en la tabla de categorías
        onDelete: 'RESTRICT' // Opcional: Restringe la eliminación si hay clientes asociados
    },
    Empleado_Id: { // Identificador de la categoría del producto
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Nombre de la tabla a la que hace referencia
            key: 'id'            // Clave primaria en la tabla de categorías
        },
        onUpdate: 'CASCADE', // Opcional: Actualiza las referencias si se cambia la clave primaria en la tabla de categorías
        onDelete: 'RESTRICT' // Opcional: Restringe la eliminación si hay empleados asociados
    }
}, {
    tableName: 'appointment'
});

module.exports = Appointment;
