const express = require('express');
const router = express.Router();
const shoppingController = require('../controllers/shoppingController');
const validateShopping = require('../middlewares/validateShopping');


router.post('/', validateShopping, shoppingController.createShopping);


router.get('/:id', shoppingController.getShoppingById);


router.get('/', shoppingController.getAllShopping);

router.patch('/:id/cancel', shoppingController.cancelShopping);

module.exports = router;
