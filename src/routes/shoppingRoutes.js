const express = require('express');
const shoppingController = require('../controllers/shoppingController');
const validateShopping = require('../middlewares/validateShopping');

const router = express.Router();

router.get('/', shoppingController.getAllShopping);
router.get('/:id', shoppingController.getShopphingById);
router.post('/', validateShopping, shoppingController.createShopping);
router.put('/:id', validateShopping, shoppingController.updateShopping);
router.delete('/:id', shoppingController.deleteShopping);

module.exports = router;