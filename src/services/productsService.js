const productRepository = require('../repositories/productsRepository');

const getAllProducts = async () => {
    return await productRepository.getAllProducts();
};

const getProductById = async (id) => {
    return await productRepository.getProductById(id);
};

const createProduct = async (productdata) => {
    return await productRepository.createProduct(productdata);

};
const updateProduct = async (id, productdata) => {
    return await productRepository.updateProduct(id, productdata);
};

const deleteProduct = async (id) => {
    return await productRepository.deleteProduct(id);
};


// Actualizar el estado de un producto
const updateProductStatus = async (id, status) => {
    const product = await productRepository.getProductById(id);
    if (!product) return null;

    return await productRepository.updateProduct(id, { status });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
