const { models } = require('../models');

const getAllOrders = async () => {
    return await models.Order.findAll({
        include: models.OrderDetail
    });
};

const getOrderById = async (id) => {
    return await models.Order.findByPk(id, {
        include: models.OrderDetail
    });
};

const createOrder = async (data) => {
    const { orderDetails, ...orderData } = data;
    const order = await models.Order.create(orderData);
    if (orderDetails && orderDetails.length > 0) {
        for (const detail of orderDetails) {
            await models.OrderDetail.create({
                ...detail,
                order_id: order.id
            });
        }
    }
    return order;
};

const updateOrder = async (id, data) => {
    const { orderDetails, ...orderData } = data;
    await models.Order.update(orderData, {
        where: { id }
    });
    if (orderDetails && orderDetails.length > 0) {
        for (const detail of orderDetails) {
            await models.OrderDetail.update(detail, {
                where: { order_id: id, product_id: detail.product_id }
            });
        }
    }
    return await models.Order.findByPk(id, {
        include: models.OrderDetail
    });
};

const deleteOrder = async (id) => {
    await models.OrderDetail.destroy({
        where: { order_id: id }
    });
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
