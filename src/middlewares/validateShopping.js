const { body, validationResult } = require('express-validator');
const { models } = require('../models');

const validateShopping = [
    body('code')
        .notEmpty().withMessage('El código es requerido')
        .isLength({ max: 50 }).withMessage('El código no puede exceder los 50 caracteres')
        .custom(async (value) => {
            const shopping = await models.Shopping.findOne({ where: { code: value } });
            if (shopping) {
                throw new Error('El código de compra ya se encuentra registrado');
            }
            return true;
        }),

    body('purchaseDate')
        .notEmpty().withMessage('La fecha de compra es requerida')
        .isISO8601().withMessage('La fecha de compra debe estar en formato YYYY-MM-DD'),

    body('registrationDate')
        .notEmpty().withMessage('La fecha de registro es requerida')
        .isISO8601().withMessage('La fecha de registro debe estar en formato YYYY-MM-DD'),

    body('total_price')
        .notEmpty().withMessage('El precio total es requerido')
        .isFloat({ min: 0 }).withMessage('El precio total debe ser un número positivo'),

    body('status')
        .notEmpty().withMessage('El estado es requerido')
        .isIn(['completada', 'anulada']).withMessage('El estado debe ser uno de los siguientes:  completada, anulada'),

    body('supplierId')
        .notEmpty().withMessage('El ID del proveedor es requerido')
];

module.exports = validateShopping;
