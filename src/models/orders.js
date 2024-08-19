const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

const Order = sequelize.define('Order', {
    Order_Date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Order_Time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    Total_Amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    Status: {
        type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Pending'
    },
    User_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    Token_Expiration: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: function() {
            const today = new Date();
            const randomDays = Math.floor(Math.random() * 3) + 1; // Número aleatorio entre 1 y 3
            today.setDate(today.getDate() + randomDays);
            return today;
        }
    }
}, {
    tableName: 'orders',
    defaultScope: {
        where: {
            Token_Expiration: {
                [Op.gt]: new Date() // Sólo incluye órdenes con tokens que no hayan expirado
            }
        }
    }
});

module.exports = Order;
