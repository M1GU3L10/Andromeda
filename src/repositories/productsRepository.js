const { models } = require('../models');
const Product = require('../models/products');
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');

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
        const newStock = product.Stock - detail.quantity;
        if (newStock < 0) {
            throw new Error(`Stock insuficiente para el producto: ${product.Product_Name}`);
        }
    }
};
}

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

const checkCategoryAssociation = async (categoryId) => {
    return await Product.findAll({ where: { Category_Id: categoryId } });
};


// Actualizar el stock basado en órdenes
const updateProductStockForOrders = async (saleDetails, transaction = null) => {
    for (const detail of saleDetails) {
        const product = await Product.findByPk(detail.id_producto, { transaction });
        if (!product) {
            throw new Error(`Producto con ID ${detail.id_producto} no encontrado.`);
        }

        const newStock = product.Stock - detail.quantity;
        if (newStock < 0) {
            throw new Error(`Stock insuficiente para el producto: ${product.Product_Name}`);
        }

        await product.update({ Stock: newStock }, { transaction });
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
        await transaction.commit();
        return createdProduct;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Actualizar un producto existente
const updateProduct = async (id, productData) => {
    const transaction = await sequelize.transaction();
    try {
        const [updatedRowsCount, updatedProducts] = await Product.update(productData, {
            where: { id },
            returning: true,
            transaction
        });

        if (updatedRowsCount === 0) {
            throw new Error('Producto no encontrado');
        }

        await transaction.commit();
        return updatedProducts[0];
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


const deleteProduct = async (id) => {
    const deletedCount = await models.Product.destroy({
        where: { id }
    });
    return deletedCount;
};

module.exports = {
    updateProductStockForPurchases,
    updateProductStockForAnulatedPurchases,
    updateProductStock,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStockForOrders
};