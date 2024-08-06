const { body, validationResult } = require('express-validator');
const { models } = require('../models');

const validateAbsence = [
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
    body('date')
        .notEmpty().withMessage('La fecha es requerida')
        .isISO8601().withMessage('La fecha debe estar en formato YYYY-MM-DD'),
    body('status')
        .isIn(['A', 'I']).withMessage('El estado debe ser A (Activo) o I (Inactivo)'),
    body('userId')
        .custom(async (userId) => {
            const user = await models.User.findByPk(userId);
            if (!user || user.roleId !== 2) {
                throw new Error('El usuario debe tener un rol de empleado');
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

module.exports = validateAbsence;