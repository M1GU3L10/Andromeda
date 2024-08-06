const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const programming = sequelize.define('programming', {
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'approved', 'rejected']]
        }
    },
    day: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
            isDate: true
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
    tableName: 'programming',
    timestamps: true
});

programming.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(programming, { foreignKey: 'userId' });

module.exports = programming;
