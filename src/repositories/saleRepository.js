const Sale = require('../models/sale');
const SaleDetail = require('../models/saleDetail');
const productRepository = require('./productsRepository');
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');
const { models } = require('../models');
const { Appointment } = require('../models');

const getSaleDetailsByAppointmentId = async (appointmentId) => {
    try {
        return await SaleDetail.findAll({
            where: { appointmentId },
            include: [
                {
                    model: Product,
                    attributes: ['name', 'price'],
                },
                {
                    model: Service,
                    attributes: ['name', 'price'],
                },
                {
                    model: User,
                    as: 'Employee',
                    attributes: ['name'],
                },
                {
                    model: Sale,
                    attributes: ['Billnumber', 'SaleDate', 'total_price'],
                    include: [
                        {
                            model: User,
                            attributes: ['name', 'email'],
                        },
                    ],
                },
            ],
        });
    } catch (error) {
        console.error('Error in getSaleDetailsByAppointmentId repository:', error);
        throw error;
    }
};

const createSale = async (saleData) => {
    const { saleDetails, appointmentData, ...sale } = saleData;
    const Transaction = await sequelize.transaction();

    try {
        // Generar un número aleatorio de tres dígitos si hay una cita, de lo contrario usar el ID secuencial
        const saleId = appointmentData
            ? Math.floor(100 + Math.random() * 900)
            : (await Sale.findOne({ order: [['id', 'DESC']], transaction: Transaction }))?.id + 1 || 1;

        console.log(`ID generado para venta y cita: ${saleId}`);

        // Crear la venta con el ID generado
        const createdSale = await Sale.create({
            ...sale,
            id: saleId
        }, { transaction: Transaction });

        console.log(`Venta creada con ID: ${createdSale.id}`);

        let createdAppointment = null;
        if (appointmentData) {
            // Crear la cita usando el mismo ID
            createdAppointment = await Appointment.create({
                id: saleId, // Usar el mismo ID que la venta
                Init_Time: appointmentData.Init_Time,
                Finish_Time: appointmentData.Finish_Time,
                Date: appointmentData.Date || sale.SaleDate,
                Total: sale.total_price,
                time_appointment: appointmentData.time_appointment,
                status: 'pendiente',
                clienteId: sale.id_usuario
            }, { transaction: Transaction });

            console.log(`Cita creada con ID: ${createdAppointment.id}`);
        }

        if (saleDetails && saleDetails.length > 0) {
            const detailsWithIds = saleDetails.map(detail => ({
                ...detail,
                id_sale: saleId,
                appointmentId: createdAppointment ? saleId : null
            }));

            await SaleDetail.bulkCreate(detailsWithIds, { transaction: Transaction });

            const productDetails = detailsWithIds.filter(detail => detail.id_producto);
            if (productDetails.length > 0) {
                await productRepository.updateProductStock(productDetails, Transaction);
            }
        }

        await Transaction.commit();
        return {
            sale: createdSale,
            appointment: createdAppointment,
            message: createdAppointment
                ? 'Venta y cita creadas exitosamente'
                : 'Venta creada exitosamente'
        };
    } catch (error) {
        await Transaction.rollback();
        console.error('Error en createSale:', error);
        throw error;
    }
};


const getSaleById = async (id) => {
    return await Sale.findByPk(id, { include: [SaleDetail] });
};
const getSaleAll = async () => {
    return await Sale.findAll({
        include: [
            {
                model: SaleDetail
            },
            {
                model: models.User,
                attributes: ['name', 'email']
            }
        ]
    });
};


const updateStatusSales = async (id, newStatus) => {
    const transaction = await sequelize.transaction();
    try {
        // 1. Actualizar el estado de la venta
        const [updatedSaleRows] = await models.Sale.update(
            { status: newStatus },
            {
                where: { id },
                transaction
            }
        );

        if (updatedSaleRows === 0) {
            await transaction.rollback();
            throw new Error('Venta no encontrada');
        }

        // 2. Intentar actualizar la cita asociada (si existe)
        const [updatedAppointmentRows] = await models.Appointment.update(
            { status: newStatus },
            {
                where: { id },
                transaction
            }
        );

        // 3. Confirmar la transacción
        await transaction.commit();

        // 4. Preparar el mensaje de respuesta
        const message = updatedAppointmentRows > 0
            ? 'Estado de la venta y cita asociada actualizados correctamente'
            : 'Estado de la venta actualizado correctamente';

        return {
            message,
            updatedSale: true,
            updatedAppointment: updatedAppointmentRows > 0
        };
    } catch (error) {
        await transaction.rollback();
        console.error('Error al actualizar el estado de la venta:', error);
        throw error;
    }
};

const cancelSale = async (id, transaction = null) => {
    const sale = await Sale.findByPk(id, {
        include: [SaleDetail],
        transaction
    });
    if (!sale) {
        throw new Error('Venta no encontrada');
    }
    if (sale.status === 'Cancelada') {
        throw new Error('Esta venta ya está cancelada');
    }
    // Cambiar estado a cancelada
    sale.status = 'Cancelada';
    // Actualizar stock de los productos
    const saleDetails = sale.SaleDetails; // Detalles de la venta
    for (const detail of saleDetails) {
        if (detail.id_producto) {
            await productRepository.updateProductStockForAnulatedSales([{
                product_id: detail.id_producto,
                quantity: detail.quantity
            }], transaction);
        }
    }
    // Guardar la venta actualizada
    await sale.save({ transaction });
};

module.exports = {
    createSale,
    getSaleById,
    getSaleAll,
    updateStatusSales,
    cancelSale,
    getSaleDetailsByAppointmentId
};