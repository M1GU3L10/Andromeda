const express = require('express');
const shoppingController = require('../controllers/shoppingController');
const validateShopping = require('../middlewares/validateShopping');

const router = express.Router();

router.get('/', shoppingController.getAllShopping);
router.get('/:id', shoppingController.getShoppingById);
router.post('/', validateShopping, shoppingController.createShopping);

module.exports = router;