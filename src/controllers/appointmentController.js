const  appointmentService = require('../services/appointmentService');
const { sendResponse, sendError } = require('../utils/response');

const getAllAppointment = async (req, res) => {
    try {
        const appointment = await appointmentService.getAllAppointment();
        sendResponse(res, appointment);
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

const createAppointment = async (req, res) => {
    try {
        const appointment= await appointmentService.createAppointment(req.body);
        sendResponse(res, appointment, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updateAppointment = async (req, res) => {
    try {
        const updated = await appointmentService.updateAppointment(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'Cita no encontrada', 404);
        }
        sendResponse(res, 'Cita actualizada correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const deleted = await appointmentService.deleteAppointment(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Cita no funciona', 404);
        }
        sendResponse(res, 'Cita eliminada correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllAppointment,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
};
