const appointmentService = require('../services/appointmentService');
const { sendResponse, sendError } = require('../utils/response');

const getAllAbsences = async (req, res) => {
    try {
        const absences = await appointmentService.getAllAbsences();
        sendResponse(res, absences);
    } catch (error) {
        sendError(res, error);
    }
};

const getAbsenceById = async (req, res) => {
    try {
        const absence = await appointmentService.getAbsenceById(req.params.id);
        if (!absence) {
            return sendError(res, 'cita no encontrada', 404);
        }
        sendResponse(res, absence);
    } catch (error) {
        sendError(res, error);
    }
};


module.exports = {
    getAllAbsences,
    getAbsenceById
};
