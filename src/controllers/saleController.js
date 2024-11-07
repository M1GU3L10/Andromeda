const saleService = require('../services/saleService');
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
      // Verifica que el campo "status" esté en el cuerpo de la solicitud
      if (!req.body.status) {
          return sendError(res, 'El estado de la venta es requerido', 400);
      }

      // Llama al servicio con el ID y el objeto de estado
      const updated = await saleService.updateStatusSales(req.params.id, req.body);
      
      // Verifica si se actualizó algún registro
      if (updated[0] === 0) {
          return sendError(res, 'Venta no encontrada', 404);
      }

      // Responde exitosamente si la actualización se realizó
      sendResponse(res, { message: 'Estado de la venta actualizado correctamente' });
  } catch (error) {
      sendError(res, error, 500);
  }
};


module.exports = {
  createSale,
  getSaleById,
  getAllSales,
  updateStatusSales
};