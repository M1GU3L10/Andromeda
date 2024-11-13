const saleService = require('../services/saleService');
const salesRepository = require('../repositories/saleRepository');
const { sendError, sendResponse } = require('../utils/response')

const createSale = async (req, res) => {
    try {
      const sale = await saleService.createSale(req.body);
      res.status(201).json(sale);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

const getSaleById = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);
    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ error: 'Sale not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllSales = async (req, res) => {
    try {
        const sales = await saleService.getSaleAll();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStatusSales = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
        return res.status(400).json({ error: 'El estado es requerido' });
    }
    const result = await salesRepository.updateStatusSales(id, status);
    res.json(result);
} catch (error) {
    console.error('Error en el controlador:', error);
    res.status(500).json({ error: error.message });
}
};

module.exports = {
  createSale,
  getSaleById,
  getAllSales,
  updateStatusSales
};