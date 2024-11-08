const Appointment = require('../models/appointment');
const AppointmentDetail = require('../models/detailAppointment');
const Service = require('../models/service');
const Sale = require('../models/sale');
const Product = require('../models/products');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

const createAppointment = async (appointmentData) => {
    const { appointmentDetails, ...appointment } = appointmentData;
    const transaction = await sequelize.transaction();

    try {
        let totalServicePrice = 0;
        let totalProductPrice = 0;
        let totalTime = 0;
        let hasProducts = false;
        let sale = null;

        // separar productos y servicios
        const serviceDetails = [];
        const productDetails = [];

        if (appointmentDetails && appointmentDetails.length > 0) {
            // Categorize details into services and products
            appointmentDetails.forEach(detail => {
                if (detail.serviceId) serviceDetails.push(detail);
                if (detail.id_producto) {
                    productDetails.push(detail);
                    hasProducts = true;
                }
            });

            // Calculate service totals
            if (serviceDetails.length > 0) {
                const serviceIds = serviceDetails.map(detail => detail.serviceId);
                const services = await Service.findAll({
                    where: { id: serviceIds },
                    transaction
                });

                totalServicePrice = services.reduce((sum, service) => sum + service.price, 0);
                totalTime = services.reduce((sum, service) => sum + service.time, 0);
            }

            // Calculate product totals
            if (productDetails.length > 0) {
                const productIds = productDetails.map(detail => detail.id_producto);
                const products = await Product.findAll({
                    where: { id: productIds },
                    transaction
                });

                totalProductPrice = products.reduce((sum, product) => sum + product.price, 0);
            }
        }

        // Calculate finish time
        const initTime = new Date(`1970-01-01T${appointment.Init_Time}Z`);
        const finishTime = new Date(initTime.getTime() + totalTime * 60000);

        // Update appointment data
        const totalAppointmentPrice = totalServicePrice + totalProductPrice;
        appointment.Total = totalAppointmentPrice;
        appointment.time_appointment = totalTime;
        appointment.Finish_Time = finishTime.toISOString().substring(11, 19);

        // Create appointment
        const createdAppointment = await Appointment.create(appointment, { transaction });

        // Create sale if there are products
        if (hasProducts) {
            sale = await Sale.create({
                Billnumber: `SALE-${Date.now()}`,
                SaleDate: appointment.Date,
                total_price: totalAppointmentPrice,
                status: 'Completada',
                id_usuario: appointment.clienteId
            }, { transaction });
        }

        // Create appointment details
        if (appointmentDetails && appointmentDetails.length > 0) {
            const detailsToCreate = appointmentDetails.map(detail => ({
                ...detail,
                appointmentId: createdAppointment.id,
                id_sale: sale ? sale.id : null
            }));

            await AppointmentDetail.bulkCreate(detailsToCreate, { transaction });
        }

        await transaction.commit();
        return {
            appointment: createdAppointment,
            sale: sale,
            totalAmount: totalAppointmentPrice
        };
    } catch (error) {
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
