const saleRepository = require('../repositories/saleRepository');

const createSale = async (saleData) => {
  // Validaciones y lógica de negocio pueden ir aquí
  return await saleRepository.createSale(saleData);
};

const getSaleById = async (id) => {
  return await saleRepository.getSaleById(id);
};

module.exports = {
  createSale,
  getSaleById,
};