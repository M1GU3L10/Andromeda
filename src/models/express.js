const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Product = require('./models/product'); // Ajusta la ruta según tu estructura
const app = express();
// Servir archivos estáticos desde el directorio 'uploads'
app.use('/uploads', express.static('uploads'));


// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Middleware para procesar datos de formularios
app.use(express.urlencoded({ extended: true }));

// Validación de datos y carga de imagen
const validateProduct = [
    body('Product_Name').notEmpty().withMessage('El nombre del producto es requerido'),
    body('Price')
        .isDecimal().withMessage('El precio debe ser un número decimal positivo')
        .isFloat({ min: 0 }).withMessage('El precio debe ser mayor o igual a 0'),
    body('Stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo o cero'),
    (req, res, next) => {
        if (req.file) {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ errors: [{ msg: 'Formato de imagen no válido. Solo se permiten JPEG, PNG y GIF.' }] });
            }
            const maxSize = 5 * 1024 * 1024;
            if (req.file.size > maxSize) {
                return res.status(400).json({ errors: [{ msg: 'El tamaño de la imagen no debe exceder 5MB.' }] });
            }
            req.body.Image = req.file.path; // Guardar la ruta del archivo en lugar del buffer
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Ruta para manejar la carga de imágenes
app.post('/api/products', upload.single('image'), validateProduct, async (req, res) => {
  try {
    await Product.create({
      Product_Name: req.body.Product_Name,
      Stock: req.body.Stock,
      Price: req.body.Price,
      Category_Id: req.body.Category_Id,
      Image: req.body.Image
    });
    res.status(201).send('Producto creado con éxito');
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).send('Error al crear el producto');
  }
});

// Servir archivos estáticos desde el directorio 'uploads'
app.use('/uploads', express.static('uploads'));

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});


app.get('/api/products/image/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT Image FROM products WHERE id = ?', [id], (err, results) => {
      if (err) {
          console.error('Error al obtener la imagen:', err);
          return res.status(500).send('Error al obtener la imagen');
      }
      if (results.length === 0) {
          return res.status(404).send('Imagen no encontrada');
      }
      const imagePath = results[0].Image;
      console.log('Ruta de la imagen:', imagePath); // Mensaje de depuración
      res.sendFile(path.resolve(imagePath), (err) => {
          if (err) {
              console.error('Error al enviar la imagen:', err);
              res.status(500).send('Error al enviar la imagen');
          }
      });
  });
});

