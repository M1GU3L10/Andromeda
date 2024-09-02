const { body, validationResult } = require('express-validator');
const { models } = require('../models');

const validateAbsence = [
    body('startTime')
        .notEmpty().withMessage('La hora de inicio es requerida')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('La hora de inicio debe estar en formato HH:MM'),

    body('endTime')
        .notEmpty().withMessage('La hora de fin es requerida')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('La hora de fin debe estar en formato HH:MM')
        .custom((value, { req }) => {
            const startTime = new Date(`${req.body.date}T${req.body.startTime}:00`); // Añadir ":00" para completar la hora
            const endTime = new Date(`${req.body.date}T${value}:00`); // Añadir ":00" para completar la hora
            if (endTime <= startTime) {
                throw new Error('La hora de fin debe ser posterior a la hora de inicio');
            }
            return true;
        }),

    body('date')
        .notEmpty().withMessage('La fecha es requerida')
        .isISO8601().withMessage('La fecha debe estar en formato YYYY-MM-DD'),

    body('status')
        .isIn(['en proceso', 'aprobado', 'no aprobado'])
        .withMessage('El estado debe ser "en proceso", "aprobado" o "no aprobado"'),

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

const validateAbsencesUpdate = [

    body('endTime')
        .custom((value, { req }) => {
            const startTime = new Date(`${req.body.date}T${req.body.startTime}:00`); // Añadir ":00" para completar la hora
            const endTime = new Date(`${req.body.date}T${value}:00`); // Añadir ":00" para completar la hora
            if (endTime <= startTime) {
                throw new Error('La hora de fin debe ser posterior a la hora de inicio');
            }
            return true;
        }),

    body('date')
        .notEmpty().withMessage('La fecha es requerida')
        .isISO8601().withMessage('La fecha debe estar en formato YYYY-MM-DD'),

    body('status')
        .isIn(['en proceso', 'aprobado', 'no aprobado'])
        .withMessage('El estado debe ser "en proceso", "aprobado" o "no aprobado"'),

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

module.exports = {
    validateAbsence,
    validateAbsencesUpdate
};