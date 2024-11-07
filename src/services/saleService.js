const saleRepository = require('../repositories/saleRepository');
const productRepository = require('../repositories/productsRepository');

const createSale = async (saleData) => {
  const { saleDetails, ...sale } = saleData;

  // Obteniendo el unitPrice desde el repositorio de productos
  const updatedSaleDetails = await Promise.all(saleDetails.map(async (detail) => {
      const product = await productRepository.getProductById(detail.id_producto);
      const unitPrice = product.Price;
      return {
          ...detail,
          unitPrice: unitPrice, // Establece el precio unitario del producto
          total_price: detail.quantity * unitPrice // Calcula el precio total
      };
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

const updateStatusSales = async (id, status) => {
  return await saleRepository.updateStatusSales(id, status);
};

module.exports = {
  createSale,
  getSaleById,
  getSaleAll,
  updateStatusSales
};