const express = require('express');
const productController = require('../controllers/productsController');
const validateProduct = require('../middlewares/validateProducts');

const router = express.Router();


router.get('/', productController.getAllProducts);


router.get('/:id', productController.getProductById);


router.post('/', validateProduct, productController.createProduct);


router.put('/:id', validateProduct, productController.updateProduct);


router.delete('/:id', productController.deleteProduct);


router.put('/:id/status', productController.updateProductStatus);

module.exports = router;
