const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const saleValidate = require('../middlewares/validateSale');

router.post('/', saleValidate,saleController.createSale);
router.get('/:id', saleController.getSaleById);
router.get('/', saleController.getAllSales);
router.put('/:id/status', saleController.updateStatusSales);
router.get('/SaleDetails/:appointmentId', saleController.getSaleDetailsByAppointmentId);

module.exports = router;            