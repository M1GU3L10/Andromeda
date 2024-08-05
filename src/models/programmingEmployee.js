const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Asegúrate de ajustar la ruta al archivo del modelo de usuario

const programming = sequelize.define('programming', {
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
       
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
       
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
       
    },
    day: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
    }
}, {
    tableName: 'programming',
    timestamps: true // Configura a true si deseas usar timestamps (createdAt, updatedAt)
});

// Definir la relación con el modelo User
programming.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(programming, { foreignKey: 'userId' });

module.exports = programming;
