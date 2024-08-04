const productRepository = require('../repositories/productRepository');

const getAllProducts = async () => {
    return await productRepository.getAllProducts();
};

const getProductById = async (id) => {
    return await productRepository.getProductById(id);
};

const createProduct = async (data) => {
    return await productRepository.createProduct(data);
};

const updateProduct = async (id, data) => {
    return await productRepository.updateProduct(id, data);
};

const deleteProduct = async (id) => {
    return await productRepository.deleteProduct(id);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
