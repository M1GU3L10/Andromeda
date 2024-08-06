const { models } = require('../models');
const Product = require('../models/products');

const updateProductStock = async (saleDetails, transaction = null) => {
    for (const detail of saleDetails) {
        const product = await Product.findByPk(detail.id_producto, { transaction });
        if (product) {
            const newStock = product.Stock - detail.quantity;
            if (newStock < 0) {
                throw new Error(`Stock insuficiente para el producto con ID ${product.id}`);
            }
            await product.update({ Stock: newStock }, { transaction });
        }
    }
};

const updateProductStockForPurchases = async (shoppingDetail, transaction = null) => {
    for (const detail of shoppingDetail) {
        const product = await Product.findByPk(detail.product_id, { transaction });
        if (product) {
            // Incrementa el stock sumando la cantidad comprada
            const newStock = product.Stock + detail.quantity;
            await product.update({ Stock: newStock }, { transaction });
        } else {
            throw new Error(`Product with ID ${detail.product_id} not found.`);
        }
    }
};


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
    deleteProduct,
    updateProductStock,
    updateProductStockForPurchases
};