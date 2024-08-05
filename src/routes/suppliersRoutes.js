const express = require('express');
const supplierController = require('../controllers/suppliersController');
const validateSupplier = require('../middlewares/validateSuppliers');

const router = express.Router();

router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);
router.post('/', validateSupplier, supplierController.createSupplier);
router.put('/:id', validateSupplier, supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;
