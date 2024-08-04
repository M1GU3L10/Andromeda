const programmingEmployeeService = require('../services/programmingemployeeService');
const { sendResponse, sendError } = require('../utils/response');

const getAllProgrammingemployees = async (req, res) => {
    try {
        const programming = await programmingEmployeeService.getAllProgrammingemployees();
        sendResponse(res, programming);
    } catch (error) {
        sendError(res, error);
    }
};

const getProgrammingemployeesById = async (req, res) => {
    try {
        const programming = await programmingEmployeeService.getProgrammingemployeesById(req.params.id);
        if (!programming) {
            return sendError(res, 'programaciòn no encontrada', 404);
        }
        sendResponse(res, programming);
    } catch (error) {
        sendError(res, error);
    }
};

const createProgrammingemployees = async (req, res) => {
    try {
        const programming = await programmingEmployeeService.createProgrammingemployees(req.body);
        sendResponse(res, programming, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updateProgrammingemployees = async (req, res) => {
    try {
        const updated = await programmingEmployeeService.updateProgrammingemployees(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'Programaciòn no encontrada', 404);
        }
        sendResponse(res, 'Programaciòn actualizada correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

const deleteprogrammingEmployee = async (req, res) => {
    try {
        const deleted = await programmingEmployeeService.deleteprogrammingEmployee(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Programaciòn no encontrada', 404);
        }
        sendResponse(res, 'Programaciòn eliminada correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllProgrammingemployees,
    getProgrammingemployeesById,
    createProgrammingemployees,
    updateProgrammingemployees,
    deleteprogrammingEmployee
};
