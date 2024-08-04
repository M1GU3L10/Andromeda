const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de importar la instancia de sequelize correctamente

const Order = sequelize.define('Order', {
    Order_Date: { // Fecha del pedido
        type: DataTypes.DATE,
        allowNull: false
    },
    Order_Time: { // Hora de registro
        type: DataTypes.TIME,
        allowNull: false
    },
    Total_Amount: { // Monto total
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    Status: { // Estado del pedido
        type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Pending'
    },
    User_Id: { // Identificador del usuario
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Nombre de la tabla a la que hace referencia
            key: 'id'      // Clave primaria en la tabla de usuarios
        },
        onUpdate: 'CASCADE', // Opcional: Actualiza las referencias si se cambia la clave primaria en la tabla de usuarios
        onDelete: 'RESTRICT' // Opcional: Restringe la eliminación si hay pedidos asociados
    }
}, {
    tableName: 'orders'
});

module.exports = Order;
