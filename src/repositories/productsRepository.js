const { models } = require('../models');
const Product = require('../models/products');
const { Transaction } = require('sequelize');
const sequelize = require('../config/database');

// Actualizar stock para ventas
const updateProductStock = async (saleDetails, transaction = null) => {
    try {
        // Iniciar una transacción si no se ha proporcionado una
        const trans = transaction || await sequelize.transaction();

        for (const detail of saleDetails) {
            const product = await Product.findByPk(detail.id_producto, { transaction: trans });

            if (product) {
                const newStock = product.Stock - detail.quantity;

                if (newStock < 0) {
                    throw new Error(`Stock insuficiente para el producto: ${product.Product_Name}`);
                }

                await product.update({ Stock: newStock }, { transaction: trans });
            }
        }

        // Si se proporcionó una transacción externa, no hagas commit
        if (!transaction) await trans.commit();
    } catch (error) {
        if (!transaction) await trans.rollback();
        throw error;
    }
};

// Actualizar stock para compras
const updateProductStockForPurchases = async (shoppingDetail, transaction = null) => {
    try {
        const trans = transaction || await sequelize.transaction();

        for (const detail of shoppingDetail) {
            const product = await Product.findByPk(detail.product_id, { transaction: trans });

            if (product) {
                const newStock = product.Stock + detail.quantity;
                await product.update({ Stock: newStock }, { transaction: trans });
            } else {
                throw new Error(`Producto con ID ${detail.product_id} no encontrado.`);
            }
        }

        if (!transaction) await trans.commit();
    } catch (error) {
        if (!transaction) await trans.rollback();
        throw error;
    }
};

// Actualizar stock para órdenes
const updateProductStockForOrders = async (orderDetails, transaction = null) => {
    try {
        const trans = transaction || await sequelize.transaction();

        for (const detail of orderDetails) {
            const product = await Product.findByPk(detail.product_id, { transaction: trans });

            if (product) {
                console.log(`Stock antes: ${product.Stock}, cantidad ordenada: ${detail.quantity}`);
                const newStock = product.Stock - detail.quantity;
                console.log(`Nuevo stock debería ser: ${newStock}`);

                if (newStock < 0) {
                    throw new Error(`Stock insuficiente para el producto con ID ${detail.product_id}.`);
                }

                await product.update({ Stock: newStock }, { transaction: trans });
                console.log(`Stock actualizado para el producto con ID ${product.id}`);
            } else {
                throw new Error(`Producto con ID ${detail.product_id} no encontrado.`);
            }
        }

        if (!transaction) await trans.commit();
    } catch (error) {
        if (!transaction) await trans.rollback();
        throw error;
    }
};

// Funciones CRUD para productos
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
