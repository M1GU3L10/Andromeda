const { models } = require('../models');
const Product = require('../models/products');
const { Transaction } = require('sequelize');
const sequelize = require('../config/database');

const updateProductStock = async (saleDetails, transaction = null) => {
    for (const detail of saleDetails) {
        const product = await Product.findByPk(detail.id_producto, { transaction });
        if (product) {
            const newStock = product.Stock - detail.quantity;
            if (newStock < 0) {
                throw new Error(`Stock insuficiente para el producto :${product.Product_Name}`);
            }
            await product.update({ Stock: newStock }, { transaction });
        }
    }
};

const updateProductStockForPurchases = async (shoppingDetail, transaction = null) => {
    for (const detail of shoppingDetail) {
        const product = await Product.findByPk(detail.product_id, { transaction });
        if (product) {
            // Incrementar el stock
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
    return await Product.findByPk(id);
};

const createProduct = async (productsData) => {
    // Iniciar una transacción
    const transaction = await sequelize.transaction();

    try {
        // Crear producto
        const createdProduct = await Product.create(productsData, { transaction });
        console.log('Created product:', createdProduct);

        // Confirmar la transacción
        await transaction.commit();
        console.log('Transaction committed.');

        return createdProduct;

    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        console.error('Transaction rolled back:', error.message);
        console.error('Error stack:', error.stack);
        throw error;
    }
};


const updateProduct = async (id, productData) => {
    // Iniciar una transacción
    const transaction = await sequelize.transaction();

    try {
        await Product.update(productData, {
            where: { id },
            transaction
        });

        // Confirmar la transacción
        await transaction.commit();
        console.log('Transaction committed.');

        return await getProductById(id);
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        console.error('Transaction rolled back:', error);
        throw error;
    }
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
