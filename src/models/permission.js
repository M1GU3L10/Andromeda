const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de importar la instancia de sequelize correctamente

const Permission = sequelize.define('Permission', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }
}, {
    tableName: 'permissions'
});


module.exports = Permission;
