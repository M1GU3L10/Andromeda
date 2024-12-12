const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./products');
const Sale = require('./sale');
const Appointment = require('./appointment');
const Service = require('./service');
const User = require('./User');

const SaleDetail = sequelize.define('SaleDetail', {
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
    },
    unitPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
    },
    total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
    },
    id_producto: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id',
        },
    },
    serviceId: {
        type: DataTypes.INTEGER,
        references: {
            model: Service,
            key: 'id',
        },
    },
    empleadoId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    id_sale: {
        type: DataTypes.INTEGER,
        references: {
            model: Sale,
            key: 'id',
        },
    },
    appointmentId: {
        type: DataTypes.INTEGER,
        references: {
            model: Appointment,
            key: 'id',
        },
    },
}, {
    tableName: 'sale_details',
    timestamps: false,
});

// Relaciones
SaleDetail.belongsTo(Product, { foreignKey: 'id_producto' });
SaleDetail.belongsTo(Service, { foreignKey: 'serviceId' });
SaleDetail.belongsTo(User, { foreignKey: 'empleadoId', as: 'Employee' });
SaleDetail.belongsTo(Sale, { foreignKey: 'id_sale' });


module.exports = SaleDetail;
