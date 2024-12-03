const sequelize = require('../config/database');
const Category = require('./category');
const Service = require('./service');
const User = require('./User');
const Role = require('./role');
const Permission = require('./permission');
const PermissionRole = require('./permissionRole');
const Shopping = require('./shopping');
const ShoppingDetail = require('./shoppingDetail');
const absence = require('./absence');
const appointment = require('./appointment');
const Absence = require('./absence');
const Sale = require('./sale');
const Detail = require('./saleDetail');
const Product = require('./products');
const supplier = require('./suppliers');
const Order = require('./orders');
const OrderDetail = require('./ordersDetail');
const Privilege = require('./privilegios');
const PrivilegePermissionRole = require('./privilegePermissionRole')

// Define associations
appointment.belongsTo(User, { foreignKey: 'clienteId' });
User.hasMany(appointment, { foreignKey: 'clienteId' });

Sale.belongsTo(User, { foreignKey: 'id_usuario' });
User.hasMany(Sale, { foreignKey: 'id_usuario' });

Sale.hasMany(Detail, { foreignKey: 'id_sale' });
Detail.belongsTo(Sale, { foreignKey: 'id_sale' });

Product.hasMany(Detail, { foreignKey: 'id_producto' });
Detail.belongsTo(Product, { foreignKey: 'id_producto' });

Service.hasMany(Detail, { foreignKey: 'serviceId' });
Detail.belongsTo(Service, { foreignKey: 'serviceId' });

User.hasMany(Detail, { foreignKey: 'empleadoId', as: 'Employee' });
Detail.belongsTo(User, { foreignKey: 'empleadoId', as: 'Employee' });

appointment.hasMany(Detail, { foreignKey: 'appointmentId' });
Detail.belongsTo(appointment, { foreignKey: 'appointmentId' });



// Definir asociaciones
Role.belongsToMany(Permission, { through: PermissionRole, as: 'permissions', foreignKey: 'roleId'});
Permission.belongsToMany(Role, { through: PermissionRole, as: 'roles', foreignKey: 'permissionId' });


const models = {
    PrivilegePermissionRole,
    Privilege,
    Category,
    Service,
    User,
    Role,
    Shopping,
    absence,
    appointment,
    Absence,
    Sale,
    Detail,
    Product,
    supplier,
    Order,
    Permission,
    PermissionRole,
    ShoppingDetail,
    OrderDetail
};

const connectDb = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Base de datos sincronizada exitosamente.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

module.exports = { models, connectDb };