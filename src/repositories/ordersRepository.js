const Order = require('../models/orders');
const OrderDetail = require('../models/ordersDetail');
const productRepository = require('./productsRepository');
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');


const getAllOrders = async () => {
<<<<<<< HEAD
    try {
        return await models.Order.findAll({
            include: models.OrderDetail // Verifica que 'OrderDetail' está correctamente relacionado y nombrado
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

const getOrderById = async (id) => {
    try {
        return await models.Order.findByPk(id, {
            include: models.OrderDetail // Asegúrate de que la relación esté definida y funcionando correctamente
        });
    } catch (error) {
        console.error(`Error fetching order with id ${id}:`, error);
        throw error;
    }
};

const createOrder = async (data) => {
    const transaction = await models.sequelize.transaction();
    try {
        const { orderDetails, ...orderData } = data;
        const order = await models.Order.create(orderData, { transaction });

        if (orderDetails && orderDetails.length > 0) {
            for (const detail of orderDetails) {
                await models.OrderDetail.create({
                    ...detail,
                    order_id: order.id
                }, { transaction });
            }
        }

        await transaction.commit();
        return order;
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating order:', error);
=======
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
>>>>>>> c7d4187479739b8e3fcd312daed7a439e4afc940
        throw error;
    }
};


const updateOrder = async (id, data) => {
<<<<<<< HEAD
    const transaction = await models.sequelize.transaction();
    try {
        const { orderDetails, ...orderData } = data;
        await models.Order.update(orderData, {
            where: { id },
            transaction
        });

        if (orderDetails && orderDetails.length > 0) {
            for (const detail of orderDetails) {
                await models.OrderDetail.update(detail, {
                    where: { order_id: id, product_id: detail.product_id },
                    transaction
                });
            }
=======
    const { orderDetails, ...orderData } = data;
    await Order.update(orderData, {
        where: { id }
    });
    if (orderDetails && orderDetails.length > 0) {
        for (const detail of orderDetails) {
            await OrderDetail.update(detail, {
                where: { order_id: id, product_id: detail.product_id }
            });
>>>>>>> c7d4187479739b8e3fcd312daed7a439e4afc940
        }

        await transaction.commit();
        return await models.Order.findByPk(id, {
            include: models.OrderDetail
        });
    } catch (error) {
        await transaction.rollback();
        console.error(`Error updating order with id ${id}:`, error);
        throw error;
    }
<<<<<<< HEAD
};

const deleteOrder = async (id) => {
    const transaction = await models.sequelize.transaction();
    try {
        await models.OrderDetail.destroy({
            where: { order_id: id },
            transaction
        });
        await models.Order.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error(`Error deleting order with id ${id}:`, error);
        throw error;
    }
=======
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
>>>>>>> c7d4187479739b8e3fcd312daed7a439e4afc940
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};