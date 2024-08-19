const orderRepository = require('../repositories/ordersRepository');

const getAllOrders = async () => {
    return await orderRepository.getAllOrders();
};

const getOrderById = async (id) => {
    return await orderRepository.getOrderById(id);
};

const createOrder = async (data) => {
    const newOrder = await orderRepository.createOrder(data);
    await checkAndConvertToSale(newOrder);
    return newOrder;
};

const updateOrder = async (id, data) => {
    const updatedOrder = await orderRepository.updateOrder(id, data);
    await checkAndConvertToSale(updatedOrder);
    return updatedOrder;
};

const deleteOrder = async (id) => {
    return await orderRepository.deleteOrder(id);
};

const checkAndConvertToSale = async (order) => {
    if (order.status === 'correcto') {
        const saleData = {
            orderId: order.id,
            ...order
        };
        await salesRepository.createSale(saleData);
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
