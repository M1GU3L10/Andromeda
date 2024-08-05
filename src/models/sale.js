const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Sale = sequelize.define('Sale', {
  numero_factura: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      is: /^[0-9]+$/,
    },
  },
  fecha_venta: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora_registro: {
    type: DataTypes.TIME,
  },
  montototal: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  estado: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    defaultValue: 'P',
    validate: {
      isIn: [['P', 'C', 'S']],
    },
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  tableName: 'sales',
});

Sale.belongsTo(User, { foreignKey: 'id_usuario' });
User.hasMany(Sale, { foreignKey: 'id_usuario' });

module.exports = Sale;