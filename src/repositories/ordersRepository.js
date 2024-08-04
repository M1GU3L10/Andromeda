const { models } = require('../models');

const getAllOrders = async () => {
    return await models.Order.findAll();
};

const getOrderById = async (id) => {
    return await models.Order.findByPk(id);
};

const createOrder = async (data) => {
    return await models.Order.create(data);
};

const updateOrder = async (id, data) => {
    return await models.Order.update(data, {
        where: { id }
    });
};

const deleteOrder = async (id) => {
    return await models.Order.destroy({
        where: { id }
    });
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
