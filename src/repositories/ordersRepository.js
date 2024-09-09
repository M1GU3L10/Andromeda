const Order = require('../models/orders');
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');
const productRepository = require('./productsRepository');

const getAllOrders = async () => {
    return await Order.findAll();
};

const getOrderById = async (id) => {
    return await Order.findByPk(id);
};

const createOrder = async (orderData) => {
    const transaction = await sequelize.transaction();

    try {
        const createdOrder = await Order.create(orderData, { transaction });

        // Asegúrate de que esta función se llame correctamente
        await productRepository.updateProductStockForOrders(orderData.orderDetails || [], transaction);

        await transaction.commit();
        return createdOrder;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const updateOrder = async (id, data) => {
    await Order.update(data, {
        where: { id }
    });

    return await Order.findByPk(id);
};

const deleteOrder = async (id) => {
    return await Order.destroy({
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
