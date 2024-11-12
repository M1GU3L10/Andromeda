const appointmentService = require('../services/appointmentService');
const { sendResponse, sendError } = require('../utils/response');

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await appointmentService.getAllAppointments();
        sendResponse(res, appointments);
    } catch (error) {
        sendError(res, error);
    }
};

const getAppointmentById = async (req, res) => {
    try {
        const appointment = await appointmentService.getAppointmentById(req.params.id);
        if (!appointment) {
            return sendError(res, 'Cita no encontrada', 404);
        }
        sendResponse(res, appointment);
    } catch (error) {
        sendError(res, error);
    }
};

const updateStatusAppointment = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return sendError(res, 'El estado de la cita es requerido', 400);
        }

        const result = await appointmentService.updateStatusAppointment(req.params.id, status);
        
        sendResponse(res, result);
    } catch (error) {
        console.error('Error en el controlador al actualizar el estado:', error.message);
        sendError(res, 'Error al actualizar el estado de la cita y la venta', 500);
    }
};


module.exports = {
    getAllAppointments,
    getAppointmentById,
    updateStatusAppointment
};
