const shoppingRepository = require('../repositories/shoppingRepository');
const productRepository = require('../repositories/productsRepository');
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');

const createShopping = async (shoppingData) => {
    const { shoppingDetails, ...shopping } = shoppingData;

    // Obteniendo el unitPrice desde el repositorio de productos si no está proporcionado
    const updatedShoppingDetails = await Promise.all(shoppingDetails.map(async (detail) => {
        const product = await productRepository.getProductById(detail.product_id);
        const unitPrice = detail.unitPrice || product.unit_price; // Usa el unit_price proporcionado o el del producto
        return {
            ...detail,
            unitPrice: unitPrice,
            total_price: detail.quantity * unitPrice // Calcula el total_price
        };
    }));

    // Calcula el total_price de la compra sumando los total_price de ShoppingDetails
    shopping.total_price = updatedShoppingDetails.reduce((acc, detail) => acc + detail.total_price, 0);

    // Pasar los datos calculados al repositorio para la creación
    return await shoppingRepository.createShopping({ ...shopping, shoppingDetails: updatedShoppingDetails });
};

const cancelShopping = async (id) => {
  const transaction = await sequelize.transaction();
  try {
      await shoppingRepository.cancelShopping(id, transaction);
      await transaction.commit();
  } catch (error) {
      await transaction.rollback();
      throw error;
  }
};
const getShoppingById = async (id) => {
  return await shoppingRepository.getShoppingById(id);
};

const getShoppingAll = async () => {
    return await shoppingRepository.getShoppingAll();
};

module.exports = {
  createShopping,
  getShoppingById,
  getShoppingAll,
  cancelShopping
};