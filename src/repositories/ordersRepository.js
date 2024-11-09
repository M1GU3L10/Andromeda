const Order = require('../models/orders');
const sequelize = require('../config/database');
const Product = require('../models/products');
const OrderDetail = require('../models/ordersDetail');

// Función para manejar el stock
const updateProductStock = async (details, increase, transaction = null) => {
    for (const detail of details) {
        const product = await Product.findByPk(detail.id_producto || detail.product_id, { transaction });
        if (product) {
            const newStock = increase ? product.Stock + detail.quantity : product.Stock - detail.quantity;
            if (newStock < 0) {
                throw new Error(`Stock insuficiente para el producto: ${product.Product_Name}`);
            }
            await product.update({ Stock: newStock }, { transaction });
        } else {
            throw new Error(`Producto con ID ${detail.id_producto || detail.product_id} no encontrado.`);
        }
    }
};

// Obtener todas las órdenes
const getAllOrders = async () => {
    return await Order.findAll({
        include: [OrderDetail]
    });
};

// Obtener órdenes por ID de usuario
const getOrderByUserId = async (userId) => {
    return await Order.findAll({
        where: {
            userId
        },
        include: [OrderDetail]
    });
};

// Obtener una orden por su ID
const getOrderById = async (id) => {
    return await Order.findByPk(id, { include: [OrderDetail] });
};

// Crear una nueva orden
const createOrder = async (orderData) => {
    const { orderDetails, ...order } = orderData;
    const transaction = await sequelize.transaction();

    try {
        // Crear la orden
        const createdOrder = await Order.create(order, { transaction });

        if (orderDetails && orderDetails.length > 0) {
            const detailsWithOrderId = orderDetails.map(detail => ({
                ...detail,
                id_order: createdOrder.id,
            }));

            await OrderDetail.bulkCreate(detailsWithOrderId, { transaction });

            // Restar stock (increase = false) si el estado es 'completada' o 'pendiente'
            if (order.status === 'Completada' || order.status === 'Pendiente') {
                await updateProductStock(detailsWithOrderId, false, transaction);
            }
        }

        await transaction.commit();
        return createdOrder;
    } catch (error) {
        await transaction.rollback();
        console.error("Error al crear la orden:", error);
        throw error;
    }
};

// Actualizar una orden existente
const updateOrder = async (id, data) => {
    const transaction = await sequelize.transaction();

    try {
        const order = await Order.findByPk(id, { include: [OrderDetail], transaction });
        if (!order) {
            throw new Error('Pedido no encontrado');
        }

        const oldStatus = order.status;
        const newStatus = data.status;

        // Solo realizar acciones de stock si el estado está cambiando
        if (oldStatus !== newStatus) {
            // Si cambia a estado cancelada, aumentar stock (increase = true)
            if (newStatus === 'Cancelada') {
                await updateProductStock(order.OrderDetails, true, transaction);
            }
            // Si cambia desde cancelada a completada o pendiente, restar stock (increase = false)
            else if (oldStatus === 'Cancelada' && (newStatus === 'Completada' || newStatus === 'Pendiente')) {
                await updateProductStock(order.OrderDetails, false, transaction);
            }
        }

        await order.update(data, { transaction });
        await transaction.commit();
        return order;
    } catch (error) {
        await transaction.rollback();
        console.error("Error al actualizar la orden:", error);
        throw error;
    }
};

// Eliminar una orden
const deleteOrder = async (id) => {
    const transaction = await sequelize.transaction();

    try {
        const order = await Order.findByPk(id, { include: [OrderDetail], transaction });
        if (!order) {
            throw new Error('Pedido no encontrado');
        }

        // Solo devolver el stock si la orden estaba en estado cancelada
        if (order.status === 'Cancelada') {
            await updateProductStock(order.OrderDetails, true, transaction);
        }

        const deleted = await order.destroy({ transaction });
        await transaction.commit();
        return deleted;
    } catch (error) {
        await transaction.rollback();
        console.error("Error al eliminar la orden:", error);
        throw error;
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    getOrderByUserId,
    createOrder,
    updateOrder,
    deleteOrder
};