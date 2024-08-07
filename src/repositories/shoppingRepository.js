const Shopping = require('../models/shopping');
const ShoppingDetail = require('../models/shoppingDetail');
const productRepository = require('./productsRepository');
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');

const createShopping = async (shoppingData) => {
    const { shoppingDetails, ...shopping } = shoppingData;

    const transaction = await sequelize.transaction();  // Cambiar Transaction a transaction

    try {
        const createdShopping = await Shopping.create(shopping, {
            include: [ShoppingDetail],
            transaction  // Cambiar Transaction a transaction
        });

        if (shoppingDetails && shoppingDetails.length > 0) {
            const detailsWithShoppingId = shoppingDetails.map(detail => ({
                ...detail,
                shopping_id: createdShopping.id,
            }));
            await ShoppingDetail.bulkCreate(detailsWithShoppingId, { transaction });  // Cambiar Transaction a transaction

            await productRepository.updateProductStockForPurchases(detailsWithShoppingId, transaction);  // Cambiar Transaction a transaction
        }

        await transaction.commit();  // Cambiar Transaction a transaction
        return createdShopping;
    } catch (error) {
        await transaction.rollback();  // Cambiar Transaction a transaction
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