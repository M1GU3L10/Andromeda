const { body, validationResult } = require('express-validator');
const { models } = require('../models');


const validateServiceRegister = [
    body('name').notEmpty().withMessage('El nombre es requerido')
    .custom(async (value) => {
        const service = await models.Service.findOne({ where: { name: value } });
        if (service) {
            throw new Error('El servicio ya se encuentra registrado');
        }
        return true;
    }),
    body('price')
        .notEmpty().withMessage('El precio total es requerido')
        .isFloat({ min: 0 }).withMessage('El precio total debe ser mayor a 0')
        .custom(value => {
            if (/[^0-9.]/.test(value)) {
                throw new Error('El precio total no debe contener letras');
            }
            return true;
        }),
    body('time')
        .isInt({ min: 15, max: 120 }).withMessage('El tiempo debe estar entre 15 y 120 minutos'),
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

const validateServiceUpdate = [
    body('price')
        .isFloat({ min: 0 }).withMessage('El precio total debe ser mayor a 0')
        .custom(value => {
            if (/[^0-9.]/.test(value)) {
                throw new Error('El precio total no debe contener letras');
            }
            return true;
        }),
    body('time')
        .isInt({ min: 15, max: 120 }).withMessage('El tiempo debe estar entre 15 y 120 minutos'),
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

module.exports = {
    validateServiceRegister,
    validateServiceUpdate
};