const { models } = require('../models');

const getAllAppointments = async () => {
    return await models.appointment.findAll();
};

const getAppointmentById = async (id) => {
    return await models.appointment.findByPk(id);
};

const updateStatusAppointment = async (id, status) => {
    return await models.appointment.update(status, {
        where: { id }
    });
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    updateStatusAppointment
};