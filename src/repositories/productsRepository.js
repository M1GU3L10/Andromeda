const Product = require('../models/products');
const sequelize = require('../config/database');

// Función genérica para actualizar el stock de productos
const updateProductStock = async (details, increase, transaction = null) => {
    for (const detail of details) {
        const product = await Product.findByPk(detail.id_producto || detail.product_id, { transaction });
        if (product) {
            const newStock = increase ? product.Stock + detail.quantity : product.Stock - detail.quantity;
            if (newStock < 0) {
                throw new Error(`Stock insuficiente para el producto: ${product.Product_Name}`);
            }
            await product.update({ Stock: newStock }, { transaction });
        } else {
            throw new Error(`Producto con ID ${detail.id_producto || detail.product_id} no encontrado.`);
        }
    }
};

// Actualizar el stock basado en ventas (órdenes)
const updateProductStockForOrders = async (saleDetails, transaction = null) => {
    return updateProductStock(saleDetails, false, transaction);
};

// Actualizar el stock basado en compras
const updateProductStockForPurchases = async (shoppingDetails, transaction = null) => {
    return updateProductStock(shoppingDetails, true, transaction);
};

// Actualizar el stock basado en compras anuladas
const updateProductStockForAnulatedPurchases = async (shoppingDetails, transaction = null) => {
    return updateProductStock(shoppingDetails, false, transaction);
};

// Verificar si una categoría está asociada a productos
const checkCategoryAssociation = async (categoryId) => {
    return await Product.findAll({ where: { Category_Id: categoryId } });
};

// Obtener todos los productos
const getAllProducts = async () => {
    return await Product.findAll();
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

// Eliminar un producto
const deleteProduct = async (id) => {
    return await Product.destroy({ where: { id } });
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
    updateProductStockForOrders,
    checkCategoryAssociation
};
