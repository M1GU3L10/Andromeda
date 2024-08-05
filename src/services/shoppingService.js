const shoppingRepository = require('../repositories/shoppingRepository');

const createShopping = async (saleData) => {
  return await shoppingRepository.createShopping(saleData);
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