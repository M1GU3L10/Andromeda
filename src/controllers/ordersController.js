const orderService = require('../services/ordersService');
const productService = require('../repositories/productsRepository');
const { sendResponse, sendError } = require('../utils/response');

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        sendResponse(res, orders);
    } catch (error) {
        console.error('Error al obtener todas las órdenes:', error);
        sendError(res, error);
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
        sendError(res, error);
    }
};

// Nueva función para obtener órdenes por ID de usuario
const getOrdersByUserId = async (userId) => {
    return await Order.findAll({
        where: { id_usuario: userId }, // Filtrar por ID de usuario
        include: [{ model: OrderDetail }] // Incluir detalles de las órdenes
    });
};

const createOrder = async (req, res) => {
    try {
        const order = await orderService.createOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Obtener el pedido actual
        const order = await orderService.getOrderById(id);
        if (!order) {
            return sendError(res, 'Pedido no encontrado', 404);
        }

        // Si el pedido está pasando a "Completado", actualizar el stock de los productos
        if (status === 'Completado' && order.status !== 'Completado') {
            for (const item of order.items) {
                const product = await productService.getProductById(item.productId);
                if (product) {
                    // Restar la cantidad del stock del producto
                    const newStock = product.Stock - item.quantity;
                    if (newStock < 0) {
                        return sendError(res, `Stock insuficiente para el producto: ${product.Product_Name}`, 400);
                    }
                    await productService.updateProduct(product.id, { Stock: newStock });
                }
            }
        }

        // Actualizar el estado del pedido
        const updated = await orderService.updateOrder(id, { status });
        if (updated[0] === 0) {
            return sendError(res, 'Pedido no encontrado', 404);
        }

        sendResponse(res, 'Pedido actualizado correctamente');
    } catch (error) {
        console.error('Error actualizando el pedido:', error);
        sendError(res, error);
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
        sendError(res, error);
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    getOrdersByUserId, // Exportar la nueva función
    createOrder,
    updateOrder,
    deleteOrder
};
