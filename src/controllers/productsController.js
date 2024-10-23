const productService = require('../services/productsService');
const { sendResponse, sendError } = require('../utils/response');

// Crear un nuevo producto
const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        sendResponse(res, product, 201);
    } catch (error) {
        sendError(res, error);
    }
};

// Obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        const productsWithImageUrls = products.map(product => ({
            ...product.toJSON(),
            Image: product.Image ? `data:${product.ImageMimeType};base64,${product.Image.toString('base64')}` : null
        }));
        sendResponse(res, productsWithImageUrls);
    } catch (error) {
        sendError(res, error);
    }
};

// Obtener un producto por su ID
const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return sendError(res, 'Producto no encontrado', 404);
        }
        const productWithImageUrl = {
            ...product.toJSON(),
            Image: product.Image ? `data:${product.ImageMimeType};base64,${product.Image.toString('base64')}` : null
        };
        sendResponse(res, productWithImageUrl);
    } catch (error) {
        sendError(res, error);
    }
};

// Actualizar un producto existente
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;

        const updatedProduct = await productService.updateProduct(id, productData);
        sendResponse(res, updatedProduct);
    } catch (error) {
        sendError(res, error);
    }
};

// Actualizar el estado de un producto
const updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedStatus = await productService.updateProductStatus(id, status);
        if (!updatedStatus) {
            return sendError(res, 'Producto no encontrado', 404);
        }
        sendResponse(res, 'Estado del producto actualizado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
    try {
        const deleted = await productService.deleteProduct(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Producto no encontrado', 404);
        }
        sendResponse(res, 'Producto eliminado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus
};
