const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role');
const Permission = require('./permission');


const PermissionRole = sequelize.define('PermissionRole', {
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'id'
        }
    },
    permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Permission,
            key: 'id'
        }
    },
}, {
    tableName: 'permissionsRole'
});

module.exports = PermissionRole;