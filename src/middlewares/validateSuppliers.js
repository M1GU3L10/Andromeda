const { body, validationResult } = require('express-validator');

const validateSupplier = [
    body('Supplier_Name').notEmpty().withMessage('El nombre es requerido'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateSupplier;
