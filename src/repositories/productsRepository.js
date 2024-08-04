const { models } = require('../models');

const getAllProducts = async () => {
    return await models.Product.findAll();
};

const getProductById = async (id) => {
    return await models.Product.findByPk(id);
};

const createProduct = async (data) => {
    return await models.Product.create(data);
};

const updateProduct = async (id, data) => {
    return await models.Product.update(data, {
        where: { id }
    });
};

const deleteProduct = async (id) => {
    return await models.Product.destroy({
        where: { id }
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
