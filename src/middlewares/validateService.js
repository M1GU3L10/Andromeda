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
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateService;