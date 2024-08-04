const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de importar la instancia de sequelize correctamente

const Role = sequelize.define('Role', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    status: {
        type: DataTypes.ENUM('A', 'I'),
        allowNull: false,
        defaultValue: 'A'
    }
}, {
    tableName: 'roles'
});

module.exports = Role;
