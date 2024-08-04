const shoppingRepository = require('../repositories/shoppingRepository');

const getAllShopping = async () => {
    return await shoppingRepository.getAllshopping();
};

const getshoppingById = async (id) => {
    return await shoppingRepository.getShoppingById(id);
};

const createshopping = async (data) => {
    return await shoppingRepository.createShopping(data);
};

const updateshopping = async (id, data) => {
    return await shoppingRepository.updateShopping(id, data);
};

const deleteshopping = async (id) => {
    return await shoppingRepository.deleteShopping(id);
};

module.exports = {
    getAllShopping,
    getshoppingById,
    createshopping,
    updateshopping,
    deleteshopping
};

