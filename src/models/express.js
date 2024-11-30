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

