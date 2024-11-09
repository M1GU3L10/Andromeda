const express = require('express');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

router.get('/', appointmentController.getAllAbsences);
router.get('/:id', appointmentController.getAbsenceById);

module.exports = router;