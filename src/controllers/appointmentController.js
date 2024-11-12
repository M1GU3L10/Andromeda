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
        if (!req.body.status) {
            return sendError(res, 'El estado de la cita es requerido', 400);
        }

        const updated = await appointmentService.updateStatusAppointment(req.params.id, { status: req.body.status });

        if (updated === 0) {
            return sendError(res, 'Cita no encontrada', 404);
        }

        sendResponse(res, { message: 'Estado de la cita actualizado correctamente' });
    } catch (error) {
        sendError(res, error, 500);
    }
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    updateStatusAppointment
};
