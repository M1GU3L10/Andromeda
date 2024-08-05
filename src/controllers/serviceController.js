const benefitService = require('../services/benefitService');
const { sendResponse, sendError } = require('../utils/response');

const getAllServices = async (req, res) => {
    try {
        const services = await benefitService.getAllServices();
        sendResponse(res, services);
    } catch (error) {
        sendError(res, error);
    }
};

const getServiceById = async (req, res) => {
    try {
        const service = await benefitService.getServiceById(req.params.id);
        if (!service) {
            return sendError(res, 'Servicio no encontrado', 404);
        }
        sendResponse(res, service);
    } catch (error) {
        sendError(res, error);
    }
};

const createService = async (req, res) => {
    try {
        const service = await benefitService.createService(req.body);
        sendResponse(res, service, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updateService = async (req, res) => {
    try {
        const updated = await benefitService.updateService(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'Servicio no encontrado', 404);
        }
        sendResponse(res, 'Servicio actualizado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

const deleteService = async (req, res) => {
    try {
        const deleted = await benefitService.deleteService(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Servicio no encontrado', 404);
        }
        sendResponse(res, 'Servicio eliminado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
