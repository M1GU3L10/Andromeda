const Shopping = require('../models/shopping');
const ShoppingDetail = require('../models/shoppingDetail');
const productRepository = require('./productsRepository');
const sequelize = require('../config/database');

const createShopping = async (shoppingData) => {
    const { shoppingDetails, ...shopping } = shoppingData;
    const transaction = await sequelize.transaction();

    try {
        // Crear la compra
        const createdShopping = await Shopping.create(shopping, {
            include: [ShoppingDetail],
            transaction
        });

        if (shoppingDetails && shoppingDetails.length > 0) {
            // Crear los detalles de la compra y actualizar el stock
            const detailsWithShoppingId = shoppingDetails.map(detail => ({
                ...detail,
                shopping_id: createdShopping.id,
            }));
            await ShoppingDetail.bulkCreate(detailsWithShoppingId, { transaction });

            // Aquí se incrementa el stock de los productos
            await productRepository.updateProductStockForPurchases(detailsWithShoppingId, transaction);
        }

        await transaction.commit();
        return createdShopping;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getShoppingById = async (id) => {
    return await Shopping.findByPk(id, { include: [ShoppingDetail] });
};

const getShoppingAll = async () => {
    return await Shopping.findAll({
        include: [ShoppingDetail]
    });
};

module.exports = {
    createShopping,
    getShoppingById,
    getShoppingAll,
};  