const { body, validationResult } = require('express-validator');
const { models } = require('../models');

const validateUser = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('El email es inválido')
        .custom(async (value) => {
            const user = await models.User.findOne({ where: { email: value } });
            if (user) {
                throw new Error('El email ya se encuentra registrado');
            }
            return true;
        }),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    body('phone').notEmpty().withMessage('El teléfono es requerido')
        .custom(async (value) => {
            const user = await models.User.findOne({ where: { phone: value } });
            if (user) {
                throw new Error('El teléfono ya se encuentra registrado');
            }
            return true;
        }),
    body('status')
        .isIn(['A', 'I']).withMessage('El estado debe ser A (Activo) o I (Inactivo)'),
    body('roleId').notEmpty().withMessage('El rol es requerido')
        .custom(async (value) => {
            const role = await models.Role.findByPk(value);
            if (!role) {
                throw new Error('El rol no es válido');
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
