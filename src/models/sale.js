const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Sale = sequelize.define('Sale', {
    Billnumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    SaleDate: {
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
        type: DataTypes.ENUM('Completada', 'Cancelada', 'Pendiente'),
        allowNull: false,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    tableName: 'sales',
    hooks: {
        beforeCreate: (sale, options) => {
            sale.registrationDate = new Date().toISOString().split('T')[0];
        },
    },
});

Sale.belongsTo(User, { foreignKey: 'id_usuario' });
User.hasMany(Sale, { foreignKey: 'id_usuario' });

module.exports = Sale;