const { body, validationResult } = require('express-validator');
const { models } = require('../models');

const validatePermissionRole = [
    body('roleId')
        .notEmpty().withMessage('El roleId es requerido')
        .isInt().withMessage('El roleId debe ser un número entero')
        .custom(async (value) => {
            const role = await models.Role.findByPk(value);
            if (!role) {
                throw new Error('El roleId no existe');
            }
            return true;
        }),
    body('permissionId')
        .notEmpty().withMessage('El permissionId es requerido')
        .isInt().withMessage('El permissionId debe ser un número entero')
        .custom(async (value) => {
            const permission = await models.Permission.findByPk(value);
            if (!permission) {
                throw new Error('El permissionId no existe');
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

module.exports = validatePermissionRole;
