const { models } = require('../models');

const getAllOrders = async () => {
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
        throw error;
    }
};

const updateOrder = async (id, data) => {
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
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
