const shoppingRepository = require('../repositories/shoppingRepository');

const createShopping = async (shoppingData) => {
  const { shoppingDetails, ...shopping } = shoppingData;

  // Calcula el total_price de ShoppingDetails
  const updatedShoppingDetails = shoppingDetails.map(detail => ({
      ...detail,
      total_price: detail.quantity * detail.unitPrice
  }));

  // Calcula el total_price para la compra sumando los total_price
  shopping.total_price = updatedShoppingDetails.reduce((acc, detail) => acc + detail.total_price, 0);

  // Pasar los datos calculados al repositorio para la creación
  return await shoppingRepository.createShopping({ ...shopping, shoppingDetails: updatedShoppingDetails });
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
  getShoppingAll
};