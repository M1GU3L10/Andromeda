const orderRepository = require('../repositories/orderRepository');

const getAllOrders = async () => {
    return await orderRepository.getAllOrders();
};

const getOrderById = async (id) => {
    return await orderRepository.getOrderById(id);
};

const createOrder = async (data) => {
    return await orderRepository.createOrder(data);
};

const updateOrder = async (id, data) => {
    return await orderRepository.updateOrder(id, data);
};

const deleteOrder = async (id) => {
    return await orderRepository.deleteOrder(id);
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
