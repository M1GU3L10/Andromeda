const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Absence = sequelize.define('Absence', {
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notEmpty: true, 
        }
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
        validate: {
            notEmpty: true, 
            isDate: true, 
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, 
            len: [1, 255] 
        }
    },
    status: {
        type: DataTypes.ENUM('A', 'I'),
        allowNull: false,
        defaultValue: 'A',
        validate: {
            isIn: [['A', 'I']]
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        validate: {
            notEmpty: true 
        }
    }
}, {
    tableName: 'absences',
    timestamps: false 
});

Absence.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Absence, { foreignKey: 'userId' });

module.exports = Absence;
