const Sale = require('../models/sale');
const SaleDetail = require('../models/saleDetail');
const productRepository = require('./productsRepository');
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');
const { models } = require('../models');

const createSale = async (saleData) => {
    const { saleDetails, appointmentData, ...sale } = saleData;
    const Transaction = await sequelize.transaction();

    try {
        // 1. Crear la venta principal
        const createdSale = await Sale.create(sale, {
            transaction: Transaction
        });

        let createdAppointment = null;
        // 2. Verificar si hay servicios en los detalles
        const hasServices = saleDetails.some(detail => detail.serviceId);
        
        if (hasServices && appointmentData) {
            // Crear la cita si hay servicios
            createdAppointment = await Appointment.create({
                Init_Time: appointmentData.Init_Time,
                Finish_Time: appointmentData.Finish_Time,
                Date: appointmentData.Date || sale.SaleDate, // Usar la fecha de venta si no se especifica
                Total: sale.total_price, // Usar el total de la venta
                time_appointment: appointmentData.time_appointment,
                status: 'pendiente',
                clienteId: sale.id_usuario // Usar el usuario de la venta como cliente
            }, {
                transaction: Transaction
            });
        }

        // 3. Crear los detalles de venta
        if (saleDetails && saleDetails.length > 0) {
            const detailsWithIds = saleDetails.map(detail => ({
                ...detail,
                id_sale: createdSale.id,
                appointmentId: hasServices ? createdAppointment.id : null
            }));

            await SaleDetail.bulkCreate(detailsWithIds, { 
                transaction: Transaction 
            });

            // 4. Actualizar el stock solo para los productos (no servicios)
            const productDetails = detailsWithIds.filter(detail => detail.id_producto);
            if (productDetails.length > 0) {
                await productRepository.updateProductStock(productDetails, Transaction);
            }
        }

        await Transaction.commit();
        
        return {
            sale: createdSale,
            appointment: createdAppointment,
            message: hasServices 
                ? 'Venta y cita creadas exitosamente' 
                : 'Venta creada exitosamente'
        };

    } catch (error) {
        await Transaction.rollback();
        throw error;
    }
};

const getSaleById = async (id) => {
    return await Sale.findByPk(id, { include: [SaleDetail] });
};

const getSaleAll = async () => {
    return await Sale.findAll({
        include: [SaleDetail]
    });
};

const updateStatusSales = async (id, status) => {
    return await models.Sale.update(status, {
        where: { id }
    });
};

const updateSaleAppointment = async (saleId, appointmentId, appointmentData) => {
    const transaction = await sequelize.transaction();

    try {
        // Verificar que la venta existe
        const sale = await Sale.findByPk(saleId, {
            include: [{
                model: SaleDetail,
                where: { appointmentId },
                required: true
            }],
            transaction
        });

        if (!sale) {
            throw new Error('Venta no encontrada o no tiene una cita asociada');
        }

        // Verificar que la cita existe
        const appointment = await models.appointment.findByPk(appointmentId, {
            transaction
        });

        if (!appointment) {
            throw new Error('Cita no encontrada');
        }

        // Actualizar solo los campos permitidos de la cita
        const updatedAppointment = await appointment.update({
            Init_Time: appointmentData.Init_Time,
            Finish_Time: appointmentData.Finish_Time,
            Date: appointmentData.Date,
            time_appointment: appointmentData.time_appointment,
            status: appointmentData.status
        }, {
            transaction,
            // No permitir actualizar campos sensibles como Total o clienteId
            fields: ['Init_Time', 'Finish_Time', 'Date', 'time_appointment', 'status']
        });

        await transaction.commit();

        return {
            message: 'Cita actualizada exitosamente',
            appointment: updatedAppointment
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    createSale,
    getSaleById,
    getSaleAll,
    updateStatusSales,
    updateSaleAppointment
};