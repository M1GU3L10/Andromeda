const { body, validationResult } = require('express-validator');
const { models } = require('../models'); // Asegúrate de que la ruta es correcta

const validatePermission = [
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validatePermission;
