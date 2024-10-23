const shoppingService = require('../services/shoppingService');

const createShopping = async (req, res) => {
    try {
        const shopping = await shoppingService.createShopping(req.body);
        res.status(201).json(shopping);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getShoppingById = async (req, res) => {
    try {
        const shopping = await shoppingService.getShoppingById(req.params.id);
        if (shopping) {
            res.json(shopping);
        } else {
            res.status(404).json({ error: 'Compra no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllShopping = async (req, res) => {
    try {
        const shopping = await shoppingService.getShoppingAll();
        res.json(shopping);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const cancelShopping = async (req, res) => {
    try {
        await shoppingService.cancelShopping(req.params.id);
        res.status(200).json({ message: 'Compra anulada y stock actualizado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createShopping,
    getShoppingById,
    getAllShopping,
    cancelShopping
};