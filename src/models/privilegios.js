const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Permission = require('./permission');

const Privilege = sequelize.define('Privilege', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Permission,
      key: 'id'
    }
  }
}, {
  tableName: 'privileges'
});

Privilege.belongsTo(Permission, { foreignKey: 'permissionId' });
Permission.hasMany(Privilege, { foreignKey: 'permissionId' });

module.exports = Privilege;