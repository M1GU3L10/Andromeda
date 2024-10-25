const Order = require('../models/orders');
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');
const productRepository = require('./productsRepository');
const OrderDetail = require('../models/ordersDetail');

const getAllOrders = async () => {
    return await Order.findAll({
        include: [OrderDetail]
    });
};

const getOrderById = async (id) => {
    return await Order.findByPk(id, { include: [OrderDetail] });
};

const createOrder = async (orderData) => {
    const { orderDetails, ...order } = orderData; // Separar los detalles de la orden

    const transaction = await sequelize.transaction();

    try {
        // Crear la orden
        const createdOrder = await Order.create(order, { transaction });

        // Verificar si se proporcionaron detalles de la orden
        if (orderDetails && orderDetails.length > 0) {
            // Añadir el ID de la orden a cada detalle
            const detailsWithOrderId = orderDetails.map(detail => ({
                ...detail,
                id_order: createdOrder.id,  // Relacionar con la orden creada
            }));

            // Crear los detalles de la orden
            await OrderDetail.bulkCreate(detailsWithOrderId, { transaction });
        }

        // Confirmar la transacción
        await transaction.commit();
        return createdOrder;
    } catch (error) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        console.error("Error al crear la orden:", error);
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
