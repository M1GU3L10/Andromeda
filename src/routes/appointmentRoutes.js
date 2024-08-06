const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const validateAppointment = require('../middlewares/validateAppointment');


const router = express.Router();

router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.post('/',validateAppointment,  appointmentController.createAppointment);
router.put('/:id',validateAppointment , appointmentController.updateAppointment);

module.exports = router;
