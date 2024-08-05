const Sale = require('../models/sale');
const SaleDetail = require('../models/saleDetail');

const createSale = async (saleData) => {
  const { saleDetails, ...sale } = saleData;

  // Crear la venta
  const createdSale = await Sale.create(sale, { include: [SaleDetail] });

  // Crear los detalles de venta
  if (saleDetails) {
    const detailsWithSaleId = saleDetails.map(detail => ({
      ...detail,
      id_sale: createdSale.id,
    }));
    await SaleDetail.bulkCreate(detailsWithSaleId);
  }

  return createdSale;
};

const getSaleById = async (id) => {
  return await Sale.findByPk(id, { include: [SaleDetail] });
};

module.exports = {
  createSale,
  getSaleById,
};