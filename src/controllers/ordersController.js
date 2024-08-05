const orderService = require('../services/ordersService');
const { sendResponse, sendError } = require('../utils/response');

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        sendResponse(res, orders);
    } catch (error) {
        sendError(res, error);
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (!order) {
            return sendError(res, 'Pedido no encontrado', 404);
        }
        sendResponse(res, order);
    } catch (error) {
        sendError(res, error);
    }
};

const createOrder = async (req, res) => {
    try {
        const order = await orderService.createOrder(req.body);
        sendResponse(res, order, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updateOrder = async (req, res) => {
    try {
        const updated = await orderService.updateOrder(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'Pedido no encontrado', 404);
        }
        sendResponse(res, 'Pedido actualizado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

const deleteOrder = async (req, res) => {
    try {
        const deleted = await orderService.deleteOrder(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Pedido no encontrado', 404);
        }
        sendResponse(res, 'Pedido eliminado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
