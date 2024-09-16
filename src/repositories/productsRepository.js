const { models } = require('../models');
const Product = models.Product; // Use the Product model from models
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');

// Helper function to find a product by ID
const findProductById = async (id, transaction = null) => {
    const product = await Product.findByPk(id, { transaction });
    if (!product) {
        throw new Error(`Producto con ID ${id} no encontrado.`);
    }
    return product;
};

// Update product stock based on sales or purchases
const updateProductStock = async (details, isOrder = true, transaction = null) => {
    for (const detail of details) {
        const product = await findProductById(detail.product_id || detail.id_producto, transaction);
        const newStock = isOrder 
            ? product.Stock - detail.quantity 
            : product.Stock + detail.quantity;
        
        if (newStock < 0) {
            throw new Error(`Stock insuficiente para el producto: ${product.Product_Name}`);
        }
        
        await product.update({ Stock: newStock }, { transaction });
    }
};

// Get all products
const getAllProducts = async () => {
    return await Product.findAll();
};

// Get a product by its ID
const getProductById = async (id) => {
    return await findProductById(id);
};

// Create a new product
const createProduct = async (productData) => {
    const transaction = await sequelize.transaction();
    try {
        const createdProduct = await Product.create(productData, { transaction });
        await transaction.commit();
        return createdProduct;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Update an existing product
const updateProduct = async (id, productData) => {
    const transaction = await sequelize.transaction();
    try {
        const product = await findProductById(id, transaction);
        await product.update(productData, { transaction });
        await transaction.commit();
        return product;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Delete a product
const deleteProduct = async (id) => {
    const transaction = await sequelize.transaction();
    try {
        const product = await findProductById(id, transaction);
        await product.destroy({ transaction });
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
};