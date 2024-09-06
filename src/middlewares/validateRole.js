const { body, validationResult } = require('express-validator');
const { models } = require('../models');

const validateRole = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('status')
    .isIn(['A', 'I']).withMessage('El estado debe ser A (Activo) o I (Inactivo)')
];

module.exports = validateRole;
