const express = require('express');
const categoryController = require('../controllers/categoryController');
const validateCategory = require('../middlewares/validateCategory');

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.get('/check-association/:categoryId', categoryController.checkCategoryAssociation);
router.get('/:id', categoryController.getCategoryById);
router.post('/', validateCategory.validateCategoryRegister, categoryController.createCategory);
router.put('/:id', validateCategory.validateCategoryUpdated, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;