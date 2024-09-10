const Appointment = require('../models/appointment');
const AppointmentDetail = require('../models/detailAppointment');
const Service = require('../models/service');
const sequelize = require('../config/database');

const createAppointment = async (appointmentData) => {
    const { appointmentDetails, ...appointment } = appointmentData;

    // Iniciar una transacción
    const transaction = await sequelize.transaction();

    try {
        // Obtener los IDs de los servicios desde los detalles
        let totalPrice = 0;
        let totalTime = 0;

        if (appointmentDetails && appointmentDetails.length > 0) {
            const serviceIds = appointmentDetails.map(detail => detail.serviceId);

            // Obtener los servicios relacionados
            const services = await Service.findAll({
                where: { id: serviceIds },
                transaction
            });

            // Sumar los precios de los servicios para calcular el total
            totalPrice = services.reduce((sum, service) => sum + service.price, 0);

            // Sumar los tiempos de los servicios para calcular el tiempo total de la cita
            totalTime = services.reduce((sum, service) => sum + service.time, 0);
        }

        // Agregar el total calculado y el tiempo a los datos de la cita
        appointment.Total = totalPrice;
        appointment.tiempo_de_la_cita = totalTime;

        // Crear la cita
        const createdAppointment = await Appointment.create(appointment, {
            include: [AppointmentDetail],
            transaction
        });

        if (appointmentDetails && appointmentDetails.length > 0) {
            // Asignar el appointmentId a los detalles y crearlos
            const detailsWithAppointmentId = appointmentDetails.map(detail => ({
                ...detail,
                appointmentId: createdAppointment.id,  // Relaciona el detalle con la cita
            }));
            await AppointmentDetail.bulkCreate(detailsWithAppointmentId, { transaction });
        }

        // Confirmar la transacción
        await transaction.commit();
        return createdAppointment;
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
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
        // Obtener los IDs de los servicios desde los detalles
        let totalPrice = 0;
        let totalTime = 0;

        if (appointmentDetails && appointmentDetails.length > 0) {
            const serviceIds = appointmentDetails.map(detail => detail.serviceId);

            // Obtener los servicios relacionados
            const services = await Service.findAll({
                where: { id: serviceIds },
                transaction
            });

            // Sumar los precios de los servicios para calcular el total
            totalPrice = services.reduce((sum, service) => sum + service.price, 0);

            // Sumar los tiempos de los servicios para calcular el tiempo total de la cita
            totalTime = services.reduce((sum, service) => sum + service.time, 0);
        }

        // Actualizar el total calculado y el tiempo en los datos de la cita
        appointment.Total = totalPrice;
        appointment.tiempo_de_la_cita = totalTime;

        // Actualizar la cita
        await Appointment.update(appointment, {
            where: { id },
            transaction
        });

        // Eliminar los detalles existentes para crear los nuevos
        await AppointmentDetail.destroy({
            where: { appointmentId: id },
            transaction
        });

        if (appointmentDetails && appointmentDetails.length > 0) {
            // Asignar el appointmentId a los nuevos detalles y crearlos
            const detailsWithAppointmentId = appointmentDetails.map(detail => ({
                ...detail,
                appointmentId: id, // Relaciona los detalles con la cita actualizada
            }));
            await AppointmentDetail.bulkCreate(detailsWithAppointmentId, { transaction });
        }

        // Confirmar la transacción
        await transaction.commit();

        // Retornar la cita actualizada
        return await Appointment.findByPk(id, { include: [AppointmentDetail] });
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    createAppointment,
    getAppointmentById,
    getAppointmentAll,
    updateAppointment
};
