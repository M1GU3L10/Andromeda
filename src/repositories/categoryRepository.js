const { models } = require('../models');

const getAllCategories = async () => {
    return await models.Category.findAll();
};

const getCategoryById = async (id) => {
    return await models.Category.findByPk(id);
};

const createCategory = async (data) => {
    return await models.Category.create(data);
};

const updateCategory = async (id, data) => {
    return await models.Category.update(data, {
        where: { id }
    });
};

const deleteCategory = async (id) => {
    return await models.Category.destroy({
        where: { id }
    });
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};