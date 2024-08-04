const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Make sure to import the sequelize instance correctly

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
            model: 'Users', // Name of the table it references
            key: 'id'      // Primary key in the Users table
        }
    }
}, {
    tableName: 'orders'
});

module.exports = Order;
