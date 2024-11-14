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
const programming = require('./programmingEmployee');
const appointment = require('./appointment');
const Absence = require('./absence');
const Programmingemployees = require('./programmingEmployee');
const Sale = require('./sale');
const Detail = require('./saleDetail');
const Product = require('./products');
const supplier = require('./suppliers');
const Order = require('./orders');
const OrderDetail = require('./ordersDetail');
const Privilege = require('./privilegios');


// Definir asociaciones
Role.belongsToMany(Permission, { through: PermissionRole, as: 'permissions', foreignKey: 'roleId'});
Permission.belongsToMany(Role, { through: PermissionRole, as: 'roles', foreignKey: 'permissionId' });


const models = {
    Privilege,
    Category,
    Service,
    User,
    Role,
    Shopping,
    absence,
    programming,
    appointment,
    Absence,
    Programmingemployees,
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