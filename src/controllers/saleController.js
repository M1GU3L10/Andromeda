const saleService = require('../services/saleService');
const salesRepository = require('../repositories/saleRepository');
const { sendError, sendResponse } = require('../utils/response')

const getSaleDetailsByAppointmentId = async (req, res) => {
  try {
      const { appointmentId } = req.params;
      const saleDetails = await saleService.getSaleDetailsByAppointmentId(appointmentId);

      if (!saleDetails || saleDetails.length === 0) {
          return res.status(404).json({ message: 'No sale details found for the specified appointment' });
      }

      res.json(saleDetails);
  } catch (error) {
      console.error('Error in getSaleDetailsByAppointmentId controller:', error);
      res.status(500).json({ error: error.message });
  }
};


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

const updateStatusSale = async (req, res) => {
  try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
          return sendError(res, 'El estado de la venta es requerido', 400);
      }

      const result = await salesRepository.updateStatusSales(id, status);
      sendResponse(res, result);
  } catch (error) {
      console.error('Error al actualizar el estado de la venta:', error.message);
      sendError(res, error.message || 'Error al actualizar el estado de la venta', 500);
  }
};

module.exports = {
  createSale,
  getSaleById,
  getAllSales,
  updateStatusSale,
  getSaleDetailsByAppointmentId
};