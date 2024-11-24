const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PermissionRole = require('./permissionRole');
const Privilege = require('./privilegios');

const PrivilegePermissionRole = sequelize.define('PrivilegePermissionRole', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  permissionRoleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PermissionRole,
      key: 'id'
    }
  },
  privilegeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Privilege,
      key: 'id'
    }
  }
}, {
  tableName: 'privilegesPermissionRole'
});

PrivilegePermissionRole.belongsTo(PermissionRole, { foreignKey: 'permissionRoleId' });
PrivilegePermissionRole.belongsTo(Privilege, { foreignKey: 'privilegeId' });

module.exports = PrivilegePermissionRole;