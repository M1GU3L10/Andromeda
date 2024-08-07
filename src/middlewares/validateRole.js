const { body, validationResult } = require('express-validator');
const { models } = require('../models');

const validateRole = [
    body('name').notEmpty().withMessage('El nombre es requerido')
    .custom(async (value) => {
        const role = await models.Role.findOne({ where: { name: value } });
        if (role) {
            throw new Error('El rol ya se encuentra registrado');
        }
        return true;
    }),
    body('status')
        .isIn(['A', 'I']).withMessage('El estado debe ser A (Activo) o I (Inactivo)'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateRole;
