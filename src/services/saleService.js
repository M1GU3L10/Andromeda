const saleRepository = require('../repositories/saleRepository');
const appointmentRepository = require('../repositories/appointment');

const createSale = async (saleData) => {
  return await saleRepository.createSale(saleData);
};

const getSaleById = async (id) => {
  return await saleRepository.getSaleById(id);
};

const getSaleAll = async () => {
  return await saleRepository.getSaleAll();
};

const updateStatusSales = async (saleId, newStatus) => {
  try {
    const result = await saleRepository.updateStatusSales(saleId, newStatus);
    
    // Actualizar el estado de la cita asociada
    const saleDetail = await saleRepository.getSaleDetailBySaleId(saleId);
    if (saleDetail && saleDetail.appointmentId) {
      await appointmentRepository.updateStatusAppointment(saleDetail.appointmentId, newStatus.status);
    }
    
    return result;
  } catch (error) {
    console.error('Error en el servicio al actualizar el estado de la venta:', error);
    throw error;
  }
};

module.exports = {
  createSale,
  getSaleById,
  getSaleAll,
  updateStatusSales
};