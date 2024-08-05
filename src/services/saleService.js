const saleRepository = require('../repositories/saleRepository');

const createSale = async (saleData) => {
    return await saleRepository.createSale(saleData);
};
const getSaleById = async (id) => {
  return await saleRepository.getSaleById(id);
};

const getSaleAll = async () => {
    return await saleRepository.getSaleAll();
};

module.exports = {
  createSale,
  getSaleById,
  getSaleAll
};