const express = require('express');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id/status', appointmentController.updateStatusAppointment);
router.get('/sale-details/:appointmentId', appointmentController.getSaleDetailsByAppointmentId);

module.exports = router; 
