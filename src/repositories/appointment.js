const sequelize = require('../config/database');
const { models } = require('../models');

const getAllAppointments = async () => {
    return await models.appointment.findAll();
};

const getAppointmentById = async (id) => {
    return await models.appointment.findByPk(id);
};

const updateStatusAppointment = async (id, status) => {
    const Transaction = await sequelize.transaction();
    try {
        if (!Transaction) {
            throw new Error("Failed to initialize transaction.");
        }

        const [updatedAppointmentCount] = await models.appointment.update(
            { status },
            {
                where: { id },
                transaction: Transaction
            }
        );

        if (updatedAppointmentCount === 0) {
            throw new Error('Cita no encontrada');
        }

        await Transaction.commit();
        return { message: 'Estado de la cita actualizado correctamente' };
    } catch (error) {
        if (Transaction) await Transaction.rollback();
        console.error('Error en el repositorio al actualizar el estado:', error.message);
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