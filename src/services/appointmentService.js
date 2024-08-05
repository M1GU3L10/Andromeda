const appointmentRepository = require('../repositories/appointmentRepository');

const getAllAppointment = async () => {
    return await appointmentRepository.getAllAppointment();
};

const getAppointmentById = async (id) => {
    return await appointmentRepository.getAppointmentById(id);
};

const createAppointment = async (data) => {
    return await appointmentRepository.createAppointment(data);
};

const updateAppointment = async (id, data) => {
    return await appointmentRepository.updateAppointment(id, data);
};

const deleteAppointment = async (id) => {
    return await appointmentRepository.deleteAppointment(id);
};

module.exports = {
    getAllAppointment,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
};

