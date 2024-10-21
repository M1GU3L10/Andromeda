const Appointment = require('../models/appointment');
const AppointmentDetail = require('../models/detailAppointment');
const Service = require('../models/service');
const sequelize = require('../config/database');
const { Op } = require('sequelize'); // Asegúrate de importar Op si es necesario

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

        // Calcular Finish_Time sumando time_appointment a Init_Time
        const initTime = new Date(`1970-01-01T${appointment.Init_Time}Z`);
        const finishTime = new Date(initTime.getTime() + totalTime * 60000); // totalTime en minutos

        // Actualizar los datos de la cita
        appointment.Total = totalPrice;
        appointment.time_appointment = totalTime;
        appointment.Finish_Time = finishTime.toISOString().substring(11, 19); // Formato HH:mm:ss

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
        let totalPrice = 0;
        let totalTime = 0;

        if (appointmentDetails && appointmentDetails.length > 0) {
            const serviceIds = appointmentDetails.map(detail => detail.serviceId);

            const services = await Service.findAll({
                where: { id: serviceIds },
                transaction
            });

            totalPrice = services.reduce((sum, service) => sum + service.price, 0);
            totalTime = services.reduce((sum, service) => sum + service.time, 0); // Recalcular tiempo
        }

        appointment.Total = totalPrice;
        appointment.time_appointment = totalTime; // Asignar tiempo total

        await Appointment.update(appointment, { where: { id }, transaction });

        await AppointmentDetail.destroy({ where: { appointmentId: id }, transaction });

        if (appointmentDetails && appointmentDetails.length > 0) {
            const detailsWithAppointmentId = appointmentDetails.map(detail => ({
                ...detail,
                appointmentId: id,
            }));
            await AppointmentDetail.bulkCreate(detailsWithAppointmentId, { transaction });
        }

        await transaction.commit();
        return await Appointment.findByPk(id, { include: [AppointmentDetail] });
    } catch (error) {
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
