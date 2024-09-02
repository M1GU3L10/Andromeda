const { body, validationResult } = require('express-validator');

const validateProduct = [
    // Validación del nombre del producto
    body('Product_Name').notEmpty().withMessage('El nombre del producto es requerido'),

    // Validación del precio
    body('Price')
        .isDecimal().withMessage('El precio debe ser un número decimal positivo')
        .isFloat({ min: 0 }).withMessage('El precio debe ser mayor o igual a 0'),

    // Validación del stock
    body('Stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo o cero'),

    // Validación y procesamiento de la imagen (opcional)
    (req, res, next) => {
        if (req.file) {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            
            // Validar el tipo MIME de la imagen
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ errors: [{ msg: 'Formato de imagen no válido. Solo se permiten JPEG, PNG y GIF.' }] });
            }
            
            // Validar el tamaño de la imagen (ejemplo: máximo 5MB)
            const maxSize = 5 * 1024 * 1024; // 5 MB
            if (req.file.size > maxSize) {
                return res.status(400).json({ errors: [{ msg: 'El tamaño de la imagen no debe exceder 5MB.' }] });
            }

            // Procesar la imagen para almacenarla en el buffer
            req.body.Image = req.file.buffer;
            req.body.ImageMimeType = req.file.mimetype;
        }

        // Validar otros errores
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateProduct;
