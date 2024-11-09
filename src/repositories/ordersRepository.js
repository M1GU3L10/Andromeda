const Order = require('../models/orders');
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');
const productRepository = require('./productsRepository');
const OrderDetail = require('../models/ordersDetail');
const Product = require('../models/products'); 

// Función para actualizar el stock en base al estado del pedido
const updateProductStock = async (orderDetails, orderStatus, transaction = null) => {
    if (orderStatus !== 'completada') {
        // No realizar ninguna actualización de stock si el pedido no está en estado "completado"
        return;
    }

    for (const detail of orderDetails) {
        const product = await Product.findByPk(detail.id_producto, { transaction });
        if (!product) {
            throw new Error(`Producto con ID ${detail.id_producto} no encontrado.`);
        }

        const newStock = product.Stock - detail.quantity;
        if (newStock < 0) {
            throw new Error(`Stock insuficiente para el producto: ${product.Product_Name}`);
        }

        await product.update({ Stock: newStock }, { transaction });
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
            userId // Filtrar órdenes por ID de usuario
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

            // Actualizar el stock de productos
            await updateProductStock(detailsWithOrderId, 'completada', transaction);
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

        await order.update(data, { transaction });

        if (oldStatus !== newStatus && newStatus === 'completado') {
            // Restar el stock solo cuando el pedido pasa a estar completado
            await updateProductStock(order.OrderDetails, 'completada', transaction);
        }

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

        // Devolver el stock si el pedido se elimina
        await updateProductStock(order.OrderDetails, 'anulada', transaction);

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
