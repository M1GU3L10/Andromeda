const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const programming = sequelize.define('programming', {
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
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
    timestamps: true
});

programming.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(programming, { foreignKey: 'userId' });

module.exports = programming;
