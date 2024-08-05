const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Absence = sequelize.define('Absence', {
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    date_absence: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },    
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('A', 'I'),
        allowNull: false,
        defaultValue: 'A'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Esto debe ser el nombre del modelo de usuario
            key: 'id'
        }
    }
}, {
    tableName: 'absences'
});

// Definir la relación con el modelo User
Absence.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Absence, { foreignKey: 'userId' });

module.exports = Absence;