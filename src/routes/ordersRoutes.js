// routes/ordersRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController');

// Definir las rutas para las órdenes
router.get('/', orderController.getAllOrders); // Obtener todas las órdenes
router.get('/:id', orderController.getOrderById); // Obtener una orden por ID
router.get('/user/:userId', orderController.getOrderByUserId); // Obtener órdenes por ID de usuario
router.post('/', orderController.createOrder); // Crear una nueva orden
router.put('/:id', orderController.updateOrder); // Actualizar una orden existente
router.delete('/:id', orderController.deleteOrder); // Eliminar una orden

module.exports = router;
