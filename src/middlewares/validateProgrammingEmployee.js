const { body, validationResult } = require('express-validator');
const { models } = require('../models');
const User = require('../models/User');

const validateProgramming = [
    body('startTime')
        .notEmpty().withMessage('La hora de inicio es requerida')
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('La hora de inicio debe estar en formato (HH:MM:SS)'),

    body('endTime')
        .notEmpty().withMessage('La hora de fin es requerida')
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('La hora de fin debe estar en formato (HH:MM:SS)')
        .custom((value, { req }) => {
            if (new Date(`1970-01-01T${value}Z`) <= new Date(`1970-01-01T${req.body.startTime}Z`)) {
                throw new Error('La hora de fin debe ser posterior a la hora de inicio');
            }
            return true;
        }),

    body('status')
        .notEmpty().withMessage('El estado es requerido')
        .isIn(['pending', 'approved', 'rejected']).withMessage('El estado debe ser uno de los siguientes: pending, approved, rejected'),

    body('day')
        .notEmpty().withMessage('El día es requerido')
        .isISO8601().withMessage('El día debe estar en formato YYYY-MM-DD'),

        body('userId')
        .custom(async (id_usuario) => {
            const user = await models.User.findByPk(id_usuario);
            if (!user || user.roleId !== 2) {
                throw new Error('El usuario debe tener un rol de barbero');
            }
            return true;
        }),
];

module.exports = validateProgramming;