const Order = require('../models/orders');
const OrderDetail = require('../models/ordersDetail');
const productRepository = require('./productsRepository');
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');


const getAllOrders = async () => {
    return await Order.findAll({
        include: [OrderDetail]
    });
};

const getOrderById = async (id) => {
    return await Order.findByPk(id, {
        include: [OrderDetail]
    });
};

const createOrder = async (orderData) => {
    const { orderDetails, ...order } = orderData;
    const transaction = await sequelize.transaction();

    try {
        const createdOrder = await Order.create(order, {
            include: [OrderDetail],
            transaction
        });

        if (orderDetails) {
            const detailsWithOrderId = orderDetails.map(detail => ({
                ...detail,
                order_id: createdOrder.id,
            }));

            await OrderDetail.bulkCreate(detailsWithOrderId, { transaction });

            // Asegúrate de que esta función se llame correctamente
            await productRepository.updateProductStockForOrders(detailsWithOrderId, transaction);
        }

        await transaction.commit();
        return createdOrder;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


const updateOrder = async (id, data) => {
    const { orderDetails, ...orderData } = data;
    await Order.update(orderData, {
        where: { id }
    });
    if (orderDetails && orderDetails.length > 0) {
        for (const detail of orderDetails) {
            await OrderDetail.update(detail, {
                where: { order_id: id, product_id: detail.product_id }
            });
        }
    }
    return await Order.findByPk(id, {
        include: OrderDetail
    });
};

const deleteOrder = async (id) => {
    await OrderDetail.destroy({
        where: { order_id: id }
    });
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