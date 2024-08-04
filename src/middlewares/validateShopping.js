const { body, validationResult } = require('express-validator');
const Supplier = require('../models/supplier'); // Ajusta la ruta al archivo del modelo de proveedor

const validateShopping = [
    body('code')
        .notEmpty().withMessage('El código es requerido')
        .isLength({ max: 50 }).withMessage('El código no puede exceder los 50 caracteres'),

    body('purchaseDate')
        .notEmpty().withMessage('La fecha de compra es requerida')
        .isISO8601().withMessage('La fecha de compra debe estar en formato YYYY-MM-DD'),

    body('registrationDate')
        .notEmpty().withMessage('La fecha de registro es requerida')
        .isISO8601().withMessage('La fecha de registro debe estar en formato YYYY-MM-DD'),

        body('totalPrice')
        .notEmpty().withMessage('El precio total es requerido')
        .isFloat({ min: 0 }).withMessage('El precio total debe ser un número positivo')
        .custom(value => {
            if (/[^0-9.]/.test(value)) {
                throw new Error('El precio total no debe contener letras');
            }
            return true;
        }),

    body('status')
        .notEmpty().withMessage('El estado es requerido')
        .isIn(['pending', 'completed', 'canceled']).withMessage('El estado debe ser uno de los siguientes: pending, completed, canceled'),

    body('supplierId')
        .notEmpty().withMessage('El ID de proveedor es requerido')
        .custom(async (supplierId) => {
            try {
                const supplier = await Supplier.findByPk(supplierId);
                if (!supplier) {
                    throw new Error('El ID de proveedor no existe');
                }
                return true;
            } catch (error) {
                throw new Error(error.message);
            }
        }),

];

module.exports = validateShopping;