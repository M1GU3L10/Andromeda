const Appointment = require('../models/appointment');
const AppointmentDetail = require('../models/detailAppointment');
const sequelize = require('../config/database');

const createAppointment = async (appointmentData) => {
    const { appointmentDetails, ...appointment } = appointmentData;

    // Iniciar una transacción
    const transaction = await sequelize.transaction();

    try {
        // Crear la cita
        const createdAppointment = await Appointment.create(appointment, {
            include: [AppointmentDetail],
            transaction
        });
        console.log('Created appointment:', createdAppointment);

        if (appointmentDetails && appointmentDetails.length > 0) {
            // Crear los detalles de la cita
            const detailsWithAppointmentId = appointmentDetails.map(detail => ({
                ...detail,
                appointment_id: createdAppointment.id,
            }));
            await AppointmentDetail.bulkCreate(detailsWithAppointmentId, { transaction });
        }

        // Confirmar la transacción
        await transaction.commit();
        console.log('Transaction committed.');

        return createdAppointment;
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        console.error('Transaction rolled back:', error);
        throw error;
    }
};

const getAppointmentById = async (id) => {
    return await Appointment.findByPk(id, { include: [AppointmentDetail] });
};

const getAppointmentAll = async () => {
    return await Appointment.findAll({
        include: [AppointmentDetail]
    });
};

const updateAppointment = async (id, appointmentData) => {
    const { appointmentDetails, ...appointment } = appointmentData;

    // Iniciar una transacción
    const transaction = await sequelize.transaction();

    try {
        // Actualizar la cita
        await Appointment.update(appointment, {
            where: { id },
            transaction
        });

        // Eliminar los detalles existentes
        await AppointmentDetail.destroy({
            where: { appointment_id: id },
            transaction
        });

        if (appointmentDetails && appointmentDetails.length > 0) {
            // Crear los nuevos detalles de la cita
            const detailsWithAppointmentId = appointmentDetails.map(detail => ({
                ...detail,
                appointment_id: id,
            }));
            await AppointmentDetail.bulkCreate(detailsWithAppointmentId, { transaction });
        }

        // Confirmar la transacción
        await transaction.commit();
        console.log('Transaction committed.');

        return await getAppointmentById(id);
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        console.error('Transaction rolled back:', error);
        throw error;
    }
};

module.exports = {
    createAppointment,
    getAppointmentById,
    getAppointmentAll,
    updateAppointment
};
