const appointmentRepository = require('../repositories/appointment');
const { models } = require('../models');
const sequelize = require('../config/database');

const getAllAppointments = async () => {
    return await appointmentRepository.getAllAppointments();
};

const getAppointmentById = async (id) => {
    return await appointmentRepository.getAppointmentById(id);
};

const updateStatusAppointment = async (id, status) => {
    const transaction = await sequelize.transaction();
    try {
        // 1. Actualizar el estado de la cita
        const updatedAppointment = await models.appointment.update(status, {
            where: { id },
            transaction
        });

        if (updatedAppointment[0] === 0) {
            await transaction.rollback();
            throw new Error('Cita no encontrada');
        }

        // 2. Verificar si la cita está asociada a una venta
        const appointment = await models.appointment.findByPk(id, { transaction });
        if (appointment && appointment.id_sale) {
            // 3. Actualizar el estado de la venta asociada
            await models.Sale.update(status, {
                where: { id: appointment.id_sale },
                transaction
            });
        }

        // 4. Confirmar la transacción
        await transaction.commit();
        return { message: 'Estado de la cita y venta actualizados correctamente' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


module.exports = {
    getAllAppointments,
    getAppointmentById,
    updateStatusAppointment
};