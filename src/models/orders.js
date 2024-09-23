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
        type: DataTypes.ENUM('Completado', 'En proceso', 'Cancelado', 'Inactivo'),
        allowNull: false,
        defaultValue: 'En proceso'
    },
    User_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    Token_Expiration: {
        type: DataTypes.DATE,
        allowNull: false,
        // El valor predeterminado se calcula en el hook
        defaultValue: function() {
            const now = new Date();
            now.setDate(now.getDate() + 3); // Añadir 3 días
            return now;
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
    