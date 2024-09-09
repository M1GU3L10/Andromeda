const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');

const app = express();

// Configura multer para almacenar archivos en la carpeta 'image'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Nombre único para el archivo
    }
});

const upload = multer({ storage: storage });

// Middleware de validación
const validateProductUpdate = [
    body('Product_Name').notEmpty().withMessage('El nombre del producto es obligatorio'),
    body('Stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo o cero'),
    body('Price').isFloat({ min: 0 }).withMessage('El precio debe ser un número decimal positivo mayor a cero'),
    body('Category_Id').isInt({ min: 1 }).withMessage('Debe seleccionar una categoría válida')
];

// Ruta para agregar un producto
app.post('/api/products', upload.single('Images '), validateProductUpdate, (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Aquí va el código para guardar el producto en la base de datos
    const { Product_Name, Stock, Price, Category_Id } = req.body;
    const imagePath = req.file ? req.file.path : null; // Ruta de la imagen si se subió

    // Lógica para guardar el producto y la imagen en la base de datos
    // ...

    res.status(200).json({ message: 'Producto agregado exitosamente' });
});
