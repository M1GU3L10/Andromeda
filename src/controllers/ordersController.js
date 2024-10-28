const orderService = require('../services/ordersService');
const productService = require('../services/productsService'); // Cambiado a servicio
const { sendResponse, sendError } = require('../utils/response');


const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        sendResponse(res, orders);
    } catch (error) {
        console.error('Error al obtener todas las órdenes:', error);
        sendError(res, 'Error al obtener las órdenes', 500);
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (!order) {
            return sendError(res, 'Pedido no encontrado', 404);
        }
        sendResponse(res, order);
    } catch (error) {
        console.error('Error al obtener el pedido por ID:', error);
        sendError(res, 'Error al obtener el pedido', 500);
    }
};
export const getOrderByUserId = async (req, res) => {
    const { userId } = req.params; // Asegúrate de que estás pasando el userId correcto
    try {
        const orders = await getOrderByUserId(userId);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las órdenes', error });
    }
};

const createOrder = async (req, res) => {
    try {
        const order = await orderService.createOrder(req.body);
        sendResponse(res, order, 201); // Usar sendResponse
    } catch (error) {
        console.error('Error creando la orden:', error);
        sendError(res, error.message || 'Error al crear la orden', 400);
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await orderService.getOrderById(id);
        if (!order) {
            return sendError(res, 'Pedido no encontrado', 404);
        }

        // Actualizar stock si el estado es 'Completado'
        if (order.items && status === 'Completada' && order.status !== 'Completada') {
            for (const item of order.items) {
                const product = await productService.getProductById(item.productId);
                if (product) {
                    const newStock = product.Stock - item.quantity;
                    if (newStock < 0) {
                        return sendError(res, `Stock insuficiente para el producto: ${product.Product_Name}`, 400);
                    }
                    await productService.updateProduct(product.id, { Stock: newStock });
                }
            }
        }

        const updated = await orderService.updateOrder(id, { status });
        if (updated[0] === 0) {
            return sendError(res, 'Pedido no encontrado', 404);
        }

        sendResponse(res, 'Pedido actualizado correctamente');
    } catch (error) {
        console.error('Error actualizando el pedido:', error);
        sendError(res, 'Error al actualizar el pedido', 500);
    }
};

const deleteOrder = async (req, res) => {
    try {
        const deleted = await orderService.deleteOrder(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Pedido no encontrado', 404);
        }
        sendResponse(res, 'Pedido eliminado correctamente');
    } catch (error) {
        console.error('Error eliminando el pedido:', error);
        sendError(res, 'Error al eliminar el pedido', 500);
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
