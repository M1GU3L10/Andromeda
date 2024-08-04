const express = require('express');
const supplierController = require('../controllers/supplierController');
const validateSupplier = require('../middlewares/validateSupplier');

const router = express.Router();

router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);
router.post('/', validateSupplier, supplierController.createSupplier);
router.put('/:id', validateSupplier, supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;
