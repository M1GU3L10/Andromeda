const Order = require('../models/orders');
const sequelize = require('../config/database');
const productRepository = require('./productsRepository');

const getAllOrders = async () => {
    return await Order.findAll();
};

const getOrderById = async (id) => {
    return await Order.findByPk(id);
};

const createOrder = async (orderData) => {
    const transaction = await sequelize.transaction(); // Inicia la transacción

    try {
        console.log('Creando orden con los datos:', orderData); // Log para depuración

        const createdOrder = await Order.create(orderData, { transaction });
        await transaction.commit(); // Confirma la transacción
        return createdOrder; // Devuelve la orden creada
    } catch (error) {
        await transaction.rollback(); // Revierte la transacción en caso de error
        console.error('Error creando la orden:', error); // Log del error
        throw new Error(`Error creando la orden: ${error.message}`);
    }
};

const updateProductStockForOrders = async (items, transaction) => {
    for (const item of items) {
        const product = await productRepository.getProductById(item.productId, { transaction });
        if (product) {
            const newStock = product.Stock - item.quantity;
            if (newStock < 0) {
                throw new Error(`Stock insuficiente para el producto: ${item.productId}`);
            }
            product.Stock = newStock;
            await product.save({ transaction });
        } else {
            throw new Error(`Producto no encontrado: ${item.productId}`);
        }
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
    updateProductStockForOrders,
    deleteOrder
};
