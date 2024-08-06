const { body, validationResult } = require('express-validator');
const { models } = require('../models');

// Función personalizada para validar el formato de la hora (HH:MM:SS)
const isValidTime = (value) => {
    const timePattern = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    return timePattern.test(value);
};

const validateAppointment = [
    body('Init_Time').notEmpty().withMessage('La hora de inicio es requerida')
        .custom(isValidTime).withMessage('La hora de inicio debe ser una hora válida (HH:MM:SS)'),
    body('Finish_Time').notEmpty().withMessage('La hora de finalización es requerida')
        .custom(isValidTime).withMessage('La hora de finalización debe ser una hora válida (HH:MM:SS)'),
    body('Date').notEmpty().withMessage('La fecha es requerida')
        .isISO8601().withMessage('La fecha debe ser una fecha válida'),
    body('Total').notEmpty().withMessage('El monto total es requerido')
        .isDecimal({ decimal_digits: '0,2' }).withMessage('El monto total debe ser un número decimal con hasta dos decimales')
        .custom(value => {
            if (parseFloat(value) < 0) {
                throw new Error('El monto total no puede ser negativo');
            }
            return true;
        }),
    body('status').isIn(['A', 'I']).withMessage('El estado debe ser A (Activo) o I (Inactivo)'),
    body('clienteId').notEmpty().withMessage('El ID del cliente es requerido')
        .custom(async value => {
            const user = await models.User.findByPk(value);
            if (!user) {
                throw new Error('El ID del cliente no es válido');
            }
            return true;
        }),
    body('empleadoId').notEmpty().withMessage('El ID del empleado es requerido')
        .custom(async value => {
            const user = await models.User.findByPk(value);
            if (!user) {
                throw new Error('El ID del empleado no es válido');
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

module.exports = validateAppointment;
