const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Absence = sequelize.define('Absence', {
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('en proceso', 'aprobado', 'no aprobado'),
        allowNull: false,
        defaultValue: 'en proceso',
    }
    ,
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
    timestamps: false 
});

Absence.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Absence, { foreignKey: 'userId' });

module.exports = Absence;