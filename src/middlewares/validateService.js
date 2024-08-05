const { body, validationResult } = require('express-validator');

const validateService= [
    body('name').notEmpty().withMessage('El nombre es requerido')
    .custom(async (value) => {
        const category = await models.Category.findOne({ where: { name: value } });
        if (category) {
            throw new Error('El servicio ya se encuentra registrado');
        }
        return true;
    }),
    body('price')
        .notEmpty().withMessage('El precio total es requerido')
        .isFloat({ min: 0 }).withMessage('El precio total debe ser un número positivo')
        .custom(value => {
            if (/[^0-9.]/.test(value)) {
                throw new Error('El precio total no debe contener letras');
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

module.exports = validateService;