const multer = require('multer');
const { body, validationResult } = require('express-validator');

// Configuración de multer para almacenar imágenes en memoria
const storage = multer.memoryStorage(); // O donde desees almacenar los archivos
const upload = multer({
  storage: storage,
  limits: {
      fileSize: 10 * 1024 * 1024 // Límite de 10 MB
  }
});

// Middleware de validación del producto
const validateProduct = [
  upload.single('Image'), // 'Image' debe coincidir con el campo en el formulario

  // Validación del nombre del producto
  body('Product_Name')
    .notEmpty().withMessage('El nombre del producto es requerido'),

  // Validación del precio
  body('Price')
    .isDecimal().withMessage('El precio debe ser un número decimal positivo')
    .isFloat({ min: 0 }).withMessage('El precio debe ser mayor o igual a 0'),

  // Validación opcional del estado del producto
  body('status')
    .optional()
    .isIn(['A', 'I']).withMessage('El estado debe ser "A" (activo) o "I" (inactivo)'),

  // Validación y procesamiento de la imagen (opcional)
  (req, res, next) => {
    if (req.file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

      // Validar el tipo MIME de la imagen
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ errors: [{ msg: 'Formato de imagen no válido. Solo se permiten JPEG, PNG y GIF.' }] });
      }

      // Procesar la imagen para almacenarla en el buffer
      req.body.Image = req.file.buffer;
      req.body.ImageMimeType = req.file.mimetype;
    }

    // Validar otros errores de campos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Pasar al siguiente middleware si todo está correcto
    next();
  }
];

module.exports = validateProduct;
