const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Asegúrate de ajustar la ruta al archivo del modelo de usuario

const Absence = sequelize.define('Absence', {
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
    tableName: 'absences',
    timestamps: true // Configura a true si deseas usar timestamps (createdAt, updatedAt)
});

// Definir la relación con el modelo User
Absence.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Absence, { foreignKey: 'userId' });

module.exports = Absence;
