const { models } = require('../models');

const getAllshopping = async () => {
    return await models.Shopping.findAll();
};

const getShoppingById = async (id) => {
    return await models.Shopping.findByPk(id);
};

const createShopping = async (data) => {
    return await models.Shopping.create(data);
};

const updateShopping = async (id, data) => {
    return await models.Shopping.update(data, {
        where: { id }
    });
};

const deleteShopping = async (id) => {
    return await models.Shopping.destroy({
        where: { id }
    });
};

module.exports = {
    getAllshopping,
    getShoppingById,
    createShopping,
    updateShopping,
    deleteShopping
};

