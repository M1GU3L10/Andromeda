const orderService = require('../services/ordersService');
const productService = require('../repositories/productsRepository'); // Asegúrate de importar el servicio de productos
const { sendResponse, sendError } = require('../utils/response');

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        sendResponse(res, orders);
    } catch (error) {
        console.error('Error al obtener todas las órdenes:', error); // Log del error
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
        console.error('Error al obtener el pedido por ID:', error); // Log del error
        sendError(res, error);
    }
};
const createOrder = async (req, res) => {
    const orderData = req.body;

    console.log('Datos de la orden recibidos:', orderData); // Log de datos para depuración

    try {
        // Asegúrate de que orderData tenga todos los campos requeridos
        const createdOrder = await orderService.createOrder(orderData);
        return res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Error creando la orden:', error.message); // Log del error
        return res.status(500).json({ error: error.message });
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
        console.error('Error actualizando el pedido:', error); // Log del error
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
        console.error('Error eliminando el pedido:', error); // Log del error
        sendError(res, error);
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
