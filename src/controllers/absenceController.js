const absenceService = require('../services/absenceService');
const { sendResponse, sendError } = require('../utils/response');

const getAllAbsences = async (req, res) => {
    try {
        const absences = await absenceService.getAllAbsences();
        sendResponse(res, absences);
    } catch (error) {
        sendError(res, error);
    }
};

const getAbsenceById = async (req, res) => {
    try {
        const absence = await absenceService.getAbsenceById(req.params.id);
        if (!absence) {
            return sendError(res, 'ausencia no encontrada', 404);
        }
        sendResponse(res, absence);
    } catch (error) {
        sendError(res, error);
    }
};

const createAbsence = async (req, res) => {
    try {
        const absence = await absenceService.createAbsence(req.body);
        sendResponse(res, absence, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updateAbsence = async (req, res) => {
    try {
        const updated = await absenceService.updateAbsence(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'Ausencia no encontrada', 404);
        }
        sendResponse(res, 'Ausencia actualizada correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

const deleteAbsence = async (req, res) => {
    try {
        const deleted = await absenceService.deleteAbsence(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Ausencia no encontrada', 404);
        }
        sendResponse(res, 'Ausencia eliminada correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllAbsences,
    getAbsenceById,
    createAbsence,
    updateAbsence,
    deleteAbsence
};
