const { body, validationResult } = require('express-validator');
const { models } = require('../models');

const validateCategoryRegister = [
    body('name').notEmpty().withMessage('El nombre es requerido')
    .custom(async (value) => {
        const category = await models.Category.findOne({ where: { name: value } });
        if (category) {
            throw new Error('La categoría ya se encuentra registrada');
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

const validateCategoryUpdated = [
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

module.exports = {validateCategoryRegister,validateCategoryUpdated};