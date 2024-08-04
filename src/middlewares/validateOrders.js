const { body, validationResult } = require('express-validator');

const validateOrder = [
    body('orderNumber').notEmpty().withMessage('El número de pedido es requerido'),
    body('orderDate').isISO8601().withMessage('La fecha del pedido debe ser una fecha válida en formato ISO 8601'),
    body('customerName').notEmpty().withMessage('El nombre del cliente es requerido'),
    body('totalAmount').isDecimal().withMessage('El monto total debe ser un número decimal positivo').isFloat({ min: 0 }).withMessage('El monto total debe ser mayor o igual a 0'),
    body('status').isIn(['Pending', 'Shipped', 'Delivered', 'Cancelled']).withMessage('El estado debe ser uno de los siguientes: Pending, Shipped, Delivered, Cancelled'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateOrder;
