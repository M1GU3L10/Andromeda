const { models } = require('../models');

const getAllAppointment = async () => {
    return await models.Appointment.findAll();
};

const getAppointmentById = async (id) => {
    return await models.Appointment.findByPk(id);
};

const createAppointment = async (data) => {
    return await models.Appointment.create(data);
};

const updateAppointment = async (id, data) => {
    return await models.Appointment.update(data, {
        where: { id }
    });
};

const deleteAppointment = async (id) => {
    return await models.Appointment.destroy({
        where: { id }
    });
};

module.exports = {
    getAllAppointment,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
};

