const { models } = require('../models');
const Product = require('../models/products');
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');

// Actualizar el stock basado en órdenes
const updateProductStock = async (saleDetails, transaction = null) => {
    for (const detail of saleDetails) {
        const product = await Product.findByPk(detail.id_producto, { transaction });
        if (product) {
            // Actualizar el stock restando la cantidad de la orden
            const newStock = product.Stock - detail.quantity;
            if (newStock < 0) {
                throw new Error(`Stock insuficiente para el producto :${product.Product_Name}`);
            }
            await product.update({ Stock: newStock }, { transaction });
        } else {
            throw new Error(`Producto con ID ${detail.product_id} no encontrado.`);
        }
    }
};

const updateProductStockForOrders = async (saleDetails, transaction = null) => {
    for (const detail of saleDetails) {
        const product = await Product.findByPk(detail.id_producto, { transaction });
        if (product) {
            // Actualizar el stock restando la cantidad de la orden
            const newStock = product.Stock - detail.quantity;
            if (newStock < 0) {
                throw new Error(`Stock insuficiente para el producto :${product.Product_Name}`);
            }
            await product.update({ Stock: newStock }, { transaction });
        } else {
            throw new Error(`Producto con ID ${detail.product_id} no encontrado.`);
        }
    }
};

// Actualizar el stock basado en compras
const updateProductStockForPurchases = async (shoppingDetail, transaction = null) => {
    for (const detail of shoppingDetail) {
        const product = await Product.findByPk(detail.product_id, { transaction });
        if (product) {
            // Incrementar el stock basado en compras
            const newStock = product.Stock + detail.quantity;
            await product.update({ Stock: newStock }, { transaction });
        } else {
            throw new Error(`Producto con ID ${detail.product_id} no encontrado.`);
        }
    }
};

const updateProductStockForAnulatedPurchases = async (shoppingDetails, transaction = null) => {
    for (const detail of shoppingDetails) {
        const product = await Product.findByPk(detail.product_id, { transaction });
        if (product) {
            // Decrementar el stock basado en la compra anulada
            const newStock = product.Stock - detail.quantity;
            if (newStock < 0) {
                throw new Error(`Stock insuficiente para el producto: ${product.Product_Name}`);
            }
            await product.update({ Stock: newStock }, { transaction });
        } else {
            throw new Error(`Producto con ID ${detail.product_id} no encontrado.`);
        }
    }
};


// Obtener todos los productos
const getAllProducts = async () => {
    return await models.Product.findAll();
};

// Obtener un producto por su ID
const getProductById = async (id) => {
    return await Product.findByPk(id);
};

// Crear un nuevo producto
const createProduct = async (productsData) => {
    const transaction = await sequelize.transaction();

    try {
        const createdProduct = await Product.create(productsData, { transaction });
        console.log('Producto creado:', createdProduct);

        // Confirmar la transacción
        await transaction.commit();
        console.log('Transacción confirmada.');

        return createdProduct;
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        console.error('Transacción revertida:', error.message);
        throw error;
    }
};

// Actualizar un producto existente o su estado
const updateProduct = async (id, productData) => {
    const transaction = await sequelize.transaction();

    try {
        // Actualizar el producto con los datos proporcionados, incluyendo el estado si se pasa
        await Product.update(productData, {
            where: { id },
            transaction
        });

        // Confirmar la transacción
        await transaction.commit();
        console.log('Transacción confirmada.');

        // Retornar el producto actualizado
        return await getProductById(id);
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        console.error('Transacción revertida:', error);
        throw error;
    }
};


// Eliminar un producto
const deleteProduct = async (id) => {
    return await models.Product.destroy({
        where: { id }
    });
};

// Actualizar un producto

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    updateProductStockForPurchases,
    updateProductStockForOrders, // Nueva función para manejar órdenes
    updateProductStockForPurchases, // Función para manejar compras
    updateProductStockForAnulatedPurchases
};
