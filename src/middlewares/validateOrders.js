const { body, validationResult } = require('express-validator');
const { models } = require('../models');

const validateOrder = [
    body('Order_Date')
        .notEmpty().withMessage('La fecha del pedido es requerida')
        .isISO8601().withMessage('La fecha del pedido debe ser una fecha válida en formato ISO 8601'),
    
    body('Order_Time')
        .notEmpty().withMessage('La hora del pedido es requerida')
        .matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('La hora del pedido debe estar en formato HH:MM:SS'),
    
    body('Total_Amount')
        .notEmpty().withMessage('El monto total es requerido')
        .isDecimal({ decimal_digits: '0,2' }).withMessage('El monto total debe ser un número decimal con hasta dos decimales')
        .custom(value => {
            if (parseFloat(value) < 0) {
                throw new Error('El monto total no puede ser negativo');
            }
            return true;
        }),
    
    body('Status')
        .notEmpty().withMessage('El estado es requerido')
        .isIn(['Pending', 'Shipped', 'Delivered', 'Cancelled']).withMessage('El estado debe ser uno de los siguientes: Pending, Shipped, Delivered, Cancelled'),

    body('User_Id')
        .notEmpty().withMessage('El ID del usuario es requerido')
        .custom(async value => {
            const user = await models.User.findByPk(value);
            if (!user) {
                throw new Error('El ID del usuario no es válido');
            }
            return true;
        }),

    body('Token_Expiration')
        .notEmpty().withMessage('La fecha de expiración de los tokens es requerida')
        .isISO8601().withMessage('La fecha de expiración debe ser una fecha válida en formato ISO 8601'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateOrder;
