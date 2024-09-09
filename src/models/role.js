const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de importar la instancia de sequelize correctamente
const Permission = require('./Permission'); // Asegúrate de que el modelo Permission esté importado


const Role = sequelize.define('Role', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('A', 'I'),
        allowNull: false,
        defaultValue: 'A'
    },
}, {
    tableName: 'roles'
});

Role.belongsToMany(Permission, { through: 'permissionsRole', onDelete: 'CASCADE' });
Permission.belongsToMany(Role, { through: 'permissionsRole', onDelete: 'CASCADE' });


module.exports = Role;
