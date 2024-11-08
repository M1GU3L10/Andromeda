const { body, validationResult } = require('express-validator');
const { models } = require('../models');

const validateSale = [
    body('Billnumber')
        .isLength({ min: 3, max: 3 }).withMessage('El número de factura debe tener exactamente 3 dígitos')
        .isNumeric().withMessage('El número de factura solo debe contener números')
        .custom(async (value) => {
            const sale = await models.Sale.findOne({ where: { Billnumber: value } });
            if (sale) {
                throw new Error('El Numero de factura ya se encuentra registrado');
            }
            return true;
        }),
    body('status')
        .isIn(['Completada', 'Cancelada','Pendiente']).withMessage('El estado debe ser Completada o Cancelada'),
    body('id_usuario')
        .custom(async (id_usuario) => {
            const user = await models.User.findByPk(id_usuario);
            if (!user || user.roleId !== 3) {
                throw new Error('El usuario debe tener un rol de cliente');
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

module.exports = validateSale;