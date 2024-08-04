const express = require('express');
const orderController = require('../controllers/orderController');
const validateOrder = require('../middlewares/validateOrder');

const router = express.Router();

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', validateOrder, orderController.createOrder);
router.put('/:id', validateOrder, orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
