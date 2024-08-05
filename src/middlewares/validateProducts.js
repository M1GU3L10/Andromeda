const { body, validationResult } = require('express-validator');

const validateProduct = [
    body('Product_Name').notEmpty().withMessage('El nombre del producto es requerido'),
    body('Price').isDecimal().withMessage('El precio debe ser un número decimal positivo').isFloat({ min: 0 }).withMessage('El precio debe ser mayor o igual a 0'),
    body('Stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo o cero'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateProduct;
