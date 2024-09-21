const categoryRepository = require('../repositories/categoryRepository');
const productRepository = require('../repositories/productsRepository');

const getAllCategories = async () => {
    return await categoryRepository.getAllCategories();
};

const getCategoryById = async (id) => {
    return await categoryRepository.getCategoryById(id);
};

const createCategory = async (data) => {
    return await categoryRepository.createCategory(data);
};

const updateCategory = async (id, data) => {
    return await categoryRepository.updateCategory(id, data);
};

const deleteCategory = async (id) => {
    return await categoryRepository.deleteCategory(id);
};

const verifyCategoryAssociation = async (categoryId) => {
    const products = await productRepository.checkCategoryAssociation(categoryId);
    return products.length > 0;
};


module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    verifyCategoryAssociation
};