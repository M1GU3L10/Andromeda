const appointmentRepository = require('../repositories/appointment');
const { updateSaleStatus } = require('../repositories/saleRepository');
const { models } = require('../models'); // Asegúrate de que "../models" apunta a la ubicación correcta

const getAllAppointments = async () => {
  return await appointmentRepository.getAllAppointments();
};

const getAppointmentById = async (id) => {
  return await appointmentRepository.getAppointmentById(id);
};

const updateStatusAppointment = async (appointmentId, newStatus) => {
  try {
    // Asegúrate de que `Appointment` esté importado correctamente
    const appointment = await models.appointment.findByPk(appointmentId);
    if (!appointment) throw new Error("Cita no encontrada");

    appointment.status = newStatus;
    await appointment.save();

    // Actualizar el estado de la venta relacionada
    if (newStatus === "completada") {
      await updateSaleStatus(appointment.saleId, "completada");
    }

    return appointment;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  updateStatusAppointment,
};
