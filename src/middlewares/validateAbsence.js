const { body } = require('express-validator');
const User = require('../models/User'); 

const validateAbsence = [
    body('date')
        .notEmpty().withMessage('La fecha es requerida')
        .isISO8601().withMessage('La fecha debe estar en formato YYYY-MM-DD'),

    body('startTime')
        .notEmpty().withMessage('La hora de inicio es requerida')
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('La hora de inicio debe estar en formato HH:MM:SS'),

    body('endTime')
        .notEmpty().withMessage('La hora de fin es requerida')
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('La hora de fin debe estar en formato HH:MM:SS')
        .custom((value, { req }) => {
            const startTime = new Date(`${req.body.date}T${req.body.startTime}`);
            const endTime = new Date(`${req.body.date}T${value}`);
            if (endTime <= startTime) {
                throw new Error('La hora de fin debe ser posterior a la hora de inicio');
            }
            return true;
        }),

    body('description')
        .notEmpty().withMessage('La descripción es requerida')
        .isLength({ min: 1, max: 255 }).withMessage('La descripción debe tener entre 1 y 255 caracteres'),

    body('status')
        .notEmpty().withMessage('El estado es requerido')
        .isIn(['A', 'I']).withMessage('El estado debe ser "A" (Activo) o "I" (Inactivo)'),

    body('userId')
        .notEmpty().withMessage('El ID de usuario es requerido')
        .custom(async (id) => {
            const user = await User.findByPk(id);
            if (!user || user.roleId !== 2) {
                throw new Error('El usuario debe tener un rol de barbero');
            }
            return true;
        })
];

module.exports = validateAbsence;