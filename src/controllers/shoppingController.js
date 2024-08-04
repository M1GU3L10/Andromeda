const shoppingService = require('../services/shoppingService');
const { sendResponse, sendError } = require('../utils/response');

const getAllShopping = async (req, res) => {
    try {
        const shopping = await shoppingService.getAllShopping();
        sendResponse(res, shopping);
    } catch (error) {
        sendError(res, error);
    }
};

const getShopphingById = async (req, res) => {
    try {
        const shopping = await shoppingService.getshoppingById(req.params.id);
        if (!shopping) {
            return sendError(res, 'compra no encontrada', 404);
        }
        sendResponse(res, shopping);
    } catch (error) {
        sendError(res, error);
    }
};

const createShopping= async (req, res) => {
    try {
        const shopping = await shoppingService.createshopping(req.body);
        sendResponse(res, shopping, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updateShopping = async (req, res) => {
    try {
        const updated = await shoppingService.updateshopping(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'Compra no encontrada', 404);
        }
        sendResponse(res, 'Compra actualizada correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

const deleteShopping = async (req, res) => {
    try {
        const deleted = await shoppingService.deleteshopping(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Compra no encontrada', 404);
        }
        sendResponse(res, 'Compra eliminada correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllShopping,
    getShopphingById,
    createShopping,
    updateShopping,
    deleteShopping
};
