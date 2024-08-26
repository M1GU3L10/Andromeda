const { body, validationResult } = require('express-validator');
const { models } = require('../models');

const validateUser = [
    body('name').optional().notEmpty().withMessage('El nombre es requerido'),
    body('password').optional().notEmpty().withMessage('La contraseña es requerida'),
    body('status').optional()
        .isIn(['A', 'I']).withMessage('El estado debe ser A (Activo) o I (Inactivo)'),
    body('roleId').optional().notEmpty().withMessage('El rol es requerido')
        .custom(async (value) => {
            if (value) { // Validar solo si se envía el roleId
                const role = await models.Role.findByPk(value);
                if (!role) {
                    throw new Error('El rol no es válido');
                }
            }
            return true;
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateUser;