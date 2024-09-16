const { body, validationResult } = require('express-validator');

const validateProduct = [
    // Validación del nombre del producto
    body('Product_Name')
        .notEmpty().withMessage('El nombre del producto es requerido')
        .isLength({ max: 255 }).withMessage('El nombre del producto no debe exceder 255 caracteres'),

    // Validación del precio
    body('Price')
        .notEmpty().withMessage('El precio es requerido')
        .isDecimal().withMessage('El precio debe ser un número decimal')
        .isFloat({ min: 0 }).withMessage('El precio debe ser mayor o igual a 0'),

    // Validación del stock
    body('Stock')
        .notEmpty().withMessage('El stock es requerido')
        .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo o cero'),

    // Validación de la categoría
    body('Category_Id')
        .notEmpty().withMessage('La categoría es requerida')
        .isInt().withMessage('La categoría debe ser un número entero'),

    // Validación del estado
    body('status')
        .optional()
        .isIn(['A', 'I']).withMessage('El estado debe ser "A" (Activo) o "I" (Inactivo)'),

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