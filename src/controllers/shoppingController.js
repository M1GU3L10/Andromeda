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
      res.status(404).json({ error: 'Shopping not found' });
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

module.exports = {
  createShopping,
  getShoppingById,
  getAllShopping
};