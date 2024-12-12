const sequelize = require('../config/database');
const Category = require('./category');
const Service = require('./service');
const User = require('./User');
const Role = require('./role');
const Permission = require('./permission');
const PermissionRole = require('./permissionRole');
const Shopping = require('./shopping');
const ShoppingDetail = require('./shoppingDetail');
const Absence = require('./absence');
const Appointment = require('./appointment');
const Sale = require('./sale');
const SaleDetail = require('./saleDetail');
const Product = require('./products');
const Supplier = require('./suppliers');
const Order = require('./orders');
const OrderDetail = require('./ordersDetail');
const Privilege = require('./privilegios');
const PrivilegePermissionRole = require('./privilegePermissionRole');

// Define associations
Appointment.belongsTo(User, { foreignKey: 'clienteId' });
User.hasMany(Appointment, { foreignKey: 'clienteId' });

Sale.belongsTo(User, { foreignKey: 'id_usuario' });
User.hasMany(Sale, { foreignKey: 'id_usuario' });

Sale.hasMany(SaleDetail, { foreignKey: 'id_sale' });
SaleDetail.belongsTo(Sale, { foreignKey: 'id_sale' });

Product.hasMany(SaleDetail, { foreignKey: 'id_producto' });
SaleDetail.belongsTo(Product, { foreignKey: 'id_producto' });

Service.hasMany(SaleDetail, { foreignKey: 'serviceId' });
SaleDetail.belongsTo(Service, { foreignKey: 'serviceId' });

User.hasMany(SaleDetail, { foreignKey: 'empleadoId', as: 'Employee' });
SaleDetail.belongsTo(User, { foreignKey: 'empleadoId', as: 'Employee' });

Appointment.hasMany(SaleDetail, { foreignKey: 'appointmentId' });
SaleDetail.belongsTo(Appointment, { foreignKey: 'appointmentId' });

// Define many-to-many associations
Role.belongsToMany(Permission, { 
    through: PermissionRole, 
    as: 'permissions', 
    foreignKey: 'roleId'
});
Permission.belongsToMany(Role, { 
    through: PermissionRole, 
    as: 'roles', 
    foreignKey: 'permissionId' 
});

const models = {
    PrivilegePermissionRole,
    Privilege,
    Category,
    Service,
    User,
    Role,
    Shopping,
    Absence,
    Appointment,
    Sale,
    SaleDetail,
    Product,
    Supplier,
    Order,
    OrderDetail,
    Permission,
    PermissionRole,
    ShoppingDetail
};

const connectDb = async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            await sequelize.sync();
        } else {
            await sequelize.sync({ alter: true });
        }
        console.log('Base de datos sincronizada exitosamente.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

module.exports = { models, connectDb };