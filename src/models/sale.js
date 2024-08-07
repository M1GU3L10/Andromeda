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
        type: DataTypes.TIME,
    },
    total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Completada', 'Cancelada'),
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
});

Sale.belongsTo(User, { foreignKey: 'id_usuario' });
User.hasMany(Sale, { foreignKey: 'id_usuario' });

module.exports = Sale;