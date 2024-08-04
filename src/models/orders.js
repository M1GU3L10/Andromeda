const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    Fecha_pedido: {
        type: DataTypes.DATE,
        allowNull: false
    },
    hora_registro: {
        type: DataTypes.TIME,
        allowNull: false
    },
    Montototal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    estado: {
        type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Pending'
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Nombre de la tabla a la que hace referencia
            key: 'id'      // Clave primaria en la tabla de usuarios
        }
    }
}, {
    tableName: 'orders'
});

module.exports = Order;
