const orderRepository = require('../repositories/ordersRepository');

const getAllOrders = async () => {
    return await orderRepository.getAllOrders();
};

const getOrderById = async (id) => {
    return await orderRepository.getOrderById(id);
};
const createOrder = async (orderData) => {
    try {
        // Validar datos antes de enviarlos al repositorio
        if (!orderData.Total_Amount || !orderData.User_Id || !orderData.Order_Date || !orderData.Order_Time) {
            throw new Error('Faltan datos requeridos para crear la orden');
        }
        
        return await orderRepository.createOrder(orderData);
    } catch (error) {
        console.error('Error en el servicio de creación de orden:', error);
        throw error; // Re-lanzar el error para manejarlo en el controlador
    }
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
