const appointmentRepository = require('../repositories/appointment');
const saleRepository = require('../repositories/saleRepository');

const getAllAppointments = async () => {
  return await appointmentRepository.getAllAppointments();
};

const getAppointmentById = async (id) => {
  return await appointmentRepository.getAppointmentById(id);
};

const updateStatusAppointment = async (appointmentId, newStatus) => {
  try {
    const result = await appointmentRepository.updateStatusAppointment(appointmentId, newStatus);
    
    // Actualizar el estado de la venta asociada
    const saleDetail = await appointmentRepository.getSaleDetailByAppointmentId(appointmentId);
    if (saleDetail) {
      await saleRepository.updateStatusSales(saleDetail.id_sale, { status: newStatus });
    }
    
    return result;
  } catch (error) {
    console.error('Error en el servicio al actualizar el estado:', error);
    throw error;
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  updateStatusAppointment,
};