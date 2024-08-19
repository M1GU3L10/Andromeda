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

const updateProductStockForOrders = async (orderDetails, transaction = null) => {
    for (const detail of orderDetails) {
        const product = await Product.findByPk(detail.product_id, { transaction });
        if (product) {
            console.log(`Stock antes: ${product.Stock}, cantidad ordenada: ${detail.quantity}`);
            const newStock = product.Stock - detail.quantity;
            console.log(`Nuevo stock debería ser: ${newStock}`);

            if (newStock < 0) {
                throw new Error(`Stock insuficiente para el producto con ID ${detail.product_id}.`);
            }

            await product.update({ Stock: newStock }, { transaction });
            console.log(`Stock actualizado para el producto con ID ${product.id}`);
        } else {
            throw new Error(`Producto con ID ${detail.product_id} no encontrado.`);
        }
    }
};


const getAllProducts = async () => {
    return await models.Product.findAll();
};

const getProductById = async (id) => {
    return await Product.findByPk(id);
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
    updateProductStockForPurchases,
    updateProductStockForOrders
};