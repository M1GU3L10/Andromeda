const { Op } = require('sequelize');
const { models, sequelize } = require('../models');
const Sale = models.Sale;
const SaleDetail = models.SaleDetail;
const Appointment = models.appointment;
const productRepository = require('./productsRepository');

const createSale = async (saleData) => {
    let transaction;
    try {
        // Iniciar transacción
        transaction = await sequelize.transaction();
        const { saleDetails, appointmentData, ...sale } = saleData;

        // 1. Crear la venta principal
        const createdSale = await Sale.create(sale, { transaction });

        let createdAppointment = null;
        // 2. Verificar si hay servicios en los detalles
        const hasServices = saleDetails.some(detail => detail.serviceId);

        if (hasServices && appointmentData) {
            // Crear la cita si hay servicios
            createdAppointment = await Appointment.create({
                Init_Time: appointmentData.Init_Time,
                Finish_Time: appointmentData.Finish_Time,
                Date: appointmentData.Date || sale.SaleDate,
                Total: sale.total_price,
                time_appointment: appointmentData.time_appointment,
                status: 'pendiente',
                clienteId: sale.id_usuario
            }, { transaction });
        }

        // 3. Crear los detalles de venta
        if (saleDetails && saleDetails.length > 0) {
            const detailsWithIds = saleDetails.map(detail => ({
                ...detail,
                id_sale: createdSale.id,
                appointmentId: hasServices ? createdAppointment.id : null
            }));

            await SaleDetail.bulkCreate(detailsWithIds, { transaction });

            // 4. Actualizar el stock solo para los productos (no servicios)
            const productDetails = detailsWithIds.filter(detail => detail.id_producto);
            if (productDetails.length > 0) {
                await productRepository.updateProductStock(productDetails, transaction);
            }
        }

        // Commit transaction
        await transaction.commit();

        return {
            sale: createdSale,
            appointment: createdAppointment,
            message: hasServices
                ? 'Venta y cita creadas exitosamente'
                : 'Venta creada exitosamente'
        };

    } catch (error) {
        // Rollback transaction en caso de error
        if (transaction) await transaction.rollback();
        throw error;
    }
};

const updateStatusSales = async (saleId, newStatus) => {
    let transaction;
    try {
        // Iniciar la transacción
        transaction = await sequelize.transaction();

        // Actualizar el estado
        const [updatedCount] = await Sale.update(
            { status: newStatus },
            {
                where: { id: saleId },
                transaction: transaction // Pasar la transacción explícitamente
            }
        );

        if (updatedCount === 0) {
            // Si no se encontró la venta, hacemos rollback y lanzamos error
            if (transaction) await transaction.rollback();
            throw new Error('Venta no encontrada');
        }

        // Si todo sale bien, hacemos commit
        await transaction.commit();
        
        return { 
            success: true,
            message: 'Estado de la venta actualizado correctamente',
            updatedStatus: newStatus
        };

    } catch (error) {
        // En caso de error, hacemos rollback si la transacción existe
        if (transaction) await transaction.rollback();
        console.error('Error al actualizar el estado de la venta:', error);
        throw new Error(`Error al actualizar el estado: ${error.message}`);
    }
};

// Los otros métodos no necesitan transacciones ya que son solo consultas
const getSaleById = async (id) => {
    return await Sale.findByPk(id, { include: [SaleDetail] });
};

const getSaleAll = async () => {
    return await Sale.findAll({
        include: [
            {
                model: SaleDetail,
                include: [
                    {
                        model: Appointment,
                        required: true
                    }
                ]
            }
        ]
    });
};

const getSaleDetailBySaleId = async (saleId) => {
    return await SaleDetail.findOne({
        where: { id_sale: saleId }
    });
};

module.exports = {
    createSale,
    getSaleById,
    getSaleAll,
    updateStatusSales,
    getSaleDetailBySaleId
};