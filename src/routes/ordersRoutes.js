// routes/ordersRoutes.js
const express = require('express');
const orderController = require('../controllers/ordersController');
const router = express.Router();

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.get('/user/:userId', orderController.getOrdersByUserId); // Nueva ruta para buscar por ID de usuario
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
    