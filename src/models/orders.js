const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
    Billnumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // Asegura que el número de factura sea único
    },
    OrderDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    registrationDate: {
        type: DataTypes.DATEONLY,
    },
    total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Completada', 'Cancelada','Pendiente'),
        allowNull: false,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    Token_Expiration: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: function() {
            const now = new Date();
            now.setDate(now.getDate() + 3);
            return now;
        }
    }
}, {
    tableName: 'orders',
    hooks: {
        beforeCreate: (order, options) => {
            order.registrationDate = new Date().toISOString().split('T')[0];
        },
    },
});

Order.belongsTo(User, { foreignKey: 'id_usuario' });
User.hasMany(Order, { foreignKey: 'id_usuario' });

module.exports = Order;
