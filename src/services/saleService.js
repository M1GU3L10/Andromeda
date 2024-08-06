const saleRepository = require('../repositories/saleRepository');

const createSale = async (saleData) => {
    const { saleDetails, ...sale } = saleData;

    // Calcula el total_price de SaleDetails
    const updatedSaleDetails = saleDetails.map(detail => ({
        ...detail,
        total_price: detail.quantity * detail.unitPrice
    }));

    // Calcula el total_price para la venta sumando los total_price de SaleDetails
    sale.total_price = updatedSaleDetails.reduce((acc, detail) => acc + detail.total_price, 0);

    // Pasar los datos calculados al repositorio para la creación
    return await saleRepository.createSale({ ...sale, saleDetails: updatedSaleDetails });
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