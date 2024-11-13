const orderRepository = require('../repositories/ordersRepository');
const productRepository = require('../repositories/productsRepository');
const saleService = require('./saleService');

const getAllOrders = async () => {
    return await orderRepository.getAllOrders();
};

const getOrderById = async (id) => {
    return await orderRepository.getOrderById(id);
};

const getOrderByUserId = async (userId) => {
    try {
        const orders = await orderRepository.getOrderByUserId(userId);
        return orders;
    } catch (error) {
        console.error('Error al buscar órdenes:', error);
        throw error;
    }
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
    try {
        console.log(order);  // Imprime la orden para ver si contiene los detalles
        if (order.status === 'Completada' || order.status === 'Cancelada') {
            const saleData = {
                Billnumber: `SAL${order.Billnumber.slice(3)}`,
                SaleDate: new Date(),
                total_price: order.total_price,
                status: order.status,
                id_usuario: order.id_usuario,
                saleDetails: []
            };

            if (order.OrderDetails && Array.isArray(order.OrderDetails)) {
                saleData.saleDetails = order.OrderDetails.map(detail => ({
                    quantity: detail.dataValues.quantity,
                    unitPrice: detail.dataValues.unitPrice,
                    total_price: detail.dataValues.total_price,
                    id_producto: detail.dataValues.id_producto
                }));
            } else {
                console.log('Detalles de la orden no encontrados o inválidos para la orden:', order.id);
                return;
            }
            

            const newSale = await saleService.createSaleFromOrder(saleData);

            if (order.status === 'Completada') {
                for (const detail of order.orderDetails) {
                    await productRepository.updateProductStock(detail.id_producto, -detail.quantity);
                }
            }

            console.log(`Venta registrada exitosamente con ID: ${newSale.id}`);
        }
    } catch (error) {
        console.error('Error al registrar la venta desde la orden:', error.message);
    }
};



module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    getOrderByUserId,
    deleteOrder
};