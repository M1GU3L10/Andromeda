const appointmentRepository = require('../repositories/appointment');
const saleRepository = require('../repositories/saleRepository');

const getAllAppointments = async () => {
  return await appointmentRepository.getAllAppointments();
};

const getAppointmentById = async (id) => {
  return await appointmentRepository.getAppointmentById(id);
};

const updateStatusAppointment = async (appointmentId, status) => {
  try {
    const result = await appointmentRepository.updateStatusAppointment(appointmentId, status);

    if (!result) {
      throw new Error("Failed to update appointment status.");
    }

    // Retrieve associated sale detail by appointment ID
    const saleDetail = await appointmentRepository.getSaleDetailByAppointmentId(appointmentId);
    if (saleDetail) {
      await saleRepository.updateStatusSales(saleDetail.id_sale, { status });
    }

    return result;
  } catch (error) {
    console.error('Error en el servicio al actualizar el estado:', error.message);
    throw new Error('No se pudo actualizar el estado de la cita y la venta asociada');
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  updateStatusAppointment,
};
