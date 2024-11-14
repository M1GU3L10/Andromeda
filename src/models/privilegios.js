const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Permission = require('./Permission');

const Privilege = sequelize.define('Privilege', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    Idpermission: {
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

Privilege.belongsTo(Permission);
Permission.hasMany(Privilege);

module.exports = Privilege;