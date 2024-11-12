const { models } = require('../models');

const getAllAppointments = async () => {
    return await models.appointment.findAll();
};

const getAppointmentById = async (id) => {
    return await models.appointment.findByPk(id);
};

const updateStatusAppointment = async (id, status) => {
    try {
        console.log("Iniciando la actualización del estado de la cita con ID:", id);

        // Actualizar el estado de la cita
        const appointmentUpdate = await models.appointment.update(
            { status },
            { where: { id } }
        );

        console.log("Resultado de la actualización de la cita:", appointmentUpdate);

        // Verifica si la cita existe
        const appointment = await models.appointment.findByPk(id);
        if (!appointment) {
            console.error('Cita no encontrada');
            throw new Error('Cita no encontrada');
        }

        // Actualizar el estado de la venta asociada si tiene un id_sale
        if (appointment.id) {
            console.log("Iniciando la actualización de la venta con ID:", appointment.id);

            const saleUpdate = await models.Sale.update(
                { status },
                { where: { id: appointment.id } }
            );

            console.log("Resultado de la actualización de la venta:", saleUpdate);
        } else {
            console.log("No se encontró una venta asociada con esta cita");
        }

        return { message: 'Estado de la cita y venta actualizados correctamente' };
    } catch (error) {
        console.error('Error en el repositorio al actualizar el estado:', error);
        throw error; // Esto permite que el error suba al servicio y luego al controlador
    }
};



module.exports = {
    getAllAppointments,
    getAppointmentById,
    updateStatusAppointment
};