const { Op, Transaction } = require('sequelize');
const { models, sequelize } = require('../models');

const getAllAppointments = async () => {
    return await models.appointment.findAll();
};

const getAppointmentById = async (id) => {
    return await models.appointment.findByPk(id);
};

const updateStatusAppointment = async (id, status) => {
    const t = await sequelize.transaction();
    try {
        const [updatedAppointmentCount] = await models.appointment.update(
            { status },
            {
                where: { id },
                transaction: t
            }
        );

        if (updatedAppointmentCount === 0) {
            await t.rollback();
            throw new Error('Cita no encontrada');
        }

        await t.commit();
        return { message: 'Estado de la cita actualizado correctamente' };
    } catch (error) {
        await t.rollback();
        console.error('Error en el repositorio al actualizar el estado:', error);
        throw error;
    }
};

const getSaleDetailByAppointmentId = async (appointmentId) => {
    return await models.Detail.findOne({
        where: { appointmentId }
    });
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    updateStatusAppointment,
    getSaleDetailByAppointmentId
};