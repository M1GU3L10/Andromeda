const multer = require('multer');
const path = require('path');
const express = require('express');
const app = express();
const Product = require('./models/product'); // Ajusta la ruta según tu estructura

// Configuración de multer para guardar archivos en 'uploads/'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para el archivo
  }
});

const upload = multer({ storage: storage });

// Ruta para manejar la carga de imágenes
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path; // Ruta del archivo guardado

    // Crea un nuevo producto con la ruta de la imagen
    await Product.create({
      Product_Name: req.body.Product_Name,
      Stock: req.body.Stock,
      Price: req.body.Price,
      Category_Id: req.body.Category_Id,
      Image: imagePath // Guarda la ruta del archivo en la base de datos
    });

    res.send('Producto creado con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el producto');
  }
});

// Servir archivos estáticos desde el directorio 'uploads'
app.use('/uploads', express.static('uploads'));
