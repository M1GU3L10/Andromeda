const appointmentRepository = require('../repositories/appointmentRepository');

const createAppointment = async (appointmentData) => {
  return await appointmentRepository.createAppointment(appointmentData);
};

const getAppointmentById = async (id) => {
  return await appointmentRepository.getAppointmentById(id);
};

const getAppointmentAll = async () => {
  return await appointmentRepository.getAppointmentAll();
};

const updateAppointment = async (id, appointmentData) => {
  return await appointmentRepository.updateAppointment(id, appointmentData);
};

module.exports = {
  createAppointment,
  getAppointmentById,
  getAppointmentAll,
  updateAppointment
};
