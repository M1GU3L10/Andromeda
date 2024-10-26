const orderRepository = require('../repositories/ordersRepository');
const productRepository = require('../repositories/productsRepository');

const getAllOrders = async () => {
    return await orderRepository.getAllOrders();
};

const getOrderById = async (id) => {
    return await orderRepository.getOrderById(id);
};

const getOrdersByUserId = async (userId) => {
    return await orderRepository.getOrdersByUserId(userId); // Obtener órdenes por ID de usuario
};

const createOrder = async (orderData) => {
    const { orderDetails, ...order } = orderData;

    if (!Array.isArray(orderDetails)) {
        throw new Error("Faltan datos requeridos para crear la orden: orderDetails no es un array");
    }

    const updatedOrderDetails = await Promise.all(orderDetails.map(async (detail) => {
        const product = await productRepository.getProductById(detail.id_producto);
        if (!product) {
            throw new Error(`Producto no encontrado para id: ${detail.id_producto}`);
        }
        const unitPrice = product.Price;
        return {
            ...detail,
            unitPrice: unitPrice,
            total_price: detail.quantity * unitPrice
        };
    }));

    order.total_price = updatedOrderDetails.reduce((acc, detail) => acc + detail.total_price, 0);

    return await orderRepository.createOrder({ ...order, orderDetails: updatedOrderDetails });
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
    getOrdersByUserId,
    deleteOrder
};
