const { body, validationResult } = require('express-validator');
const { models } = require('../models'); // Asegúrate de que la ruta es correcta

const validatePermission = [
    body('name')
        .notEmpty().withMessage('El nombre es requerido')
        .custom(async (value) => {
            const permission = await models.Permission.findOne({ where: { name: value } });
            if (permission) {
                throw new Error('El permiso ya se encuentra registrado');
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

module.exports = validatePermission;
