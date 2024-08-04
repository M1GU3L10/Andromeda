const categoryService = require('../services/categoryService');
const { sendResponse, sendError } = require('../utils/response');

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        sendResponse(res, categories);
    } catch (error) {
        sendError(res, error);
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) {
            return sendError(res, 'Categoria no encontrada', 404);
        }
        sendResponse(res, category);
    } catch (error) {
        sendError(res, error);
    }
};

const createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);
        sendResponse(res, category, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updateCategory = async (req, res) => {
    try {
        const updated = await categoryService.updateCategory(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'Categoria no encontrada', 404);
        }
        sendResponse(res, 'Categoria actualizada correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

const deleteCategory = async (req, res) => {
    try {
        const deleted = await categoryService.deleteCategory(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Category not found', 404);
        }
        sendResponse(res, 'Categoria eliminada correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};