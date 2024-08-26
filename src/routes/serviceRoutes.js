const express = require('express');
const serviceController = require('../controllers/serviceController');
const validateService = require('../middlewares/validateService');

const router = express.Router();

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.post('/', validateService.validateServiceRegister,serviceController.createService);
router.put('/:id', validateService.validateServiceUpdate,serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;