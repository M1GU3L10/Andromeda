const Shopping = require('../models/shopping');
const ShoppingDetail = require('../models/shoppingDetail');
const productRepository = require('./productsRepository');
const sequelize = require('../config/database');

const createShopping = async (shoppingData) => {
    const { shoppingDetails, ...shopping } = shoppingData;

    // Iniciar una transacción
    const transaction = await sequelize.transaction();

    try {
        // Crear la compra
        const createdShopping = await Shopping.create(shopping, {
            include: [ShoppingDetail],
            transaction
        });
        console.log('Created Shopping:', createdShopping)
        if (shoppingDetails && shoppingDetails.length > 0) {
            // Crear los detalles de la compra
            const detailsWithShoppingId = shoppingDetails.map(detail => ({
                ...detail,
                shopping_id: createdShopping.id,
            }));
            await ShoppingDetail.bulkCreate(detailsWithShoppingId, { transaction });

            // Actualizar el stock de los productos
            await productRepository.updateProductStockForPurchases(detailsWithShoppingId, transaction);
        }

        // Confirmar la transacción
        await transaction.commit();
        console.log('Transaction committed.');

        return createdShopping;
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        console.error('Transaction rolled back:', error);
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