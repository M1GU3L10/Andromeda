const Sale = require('../models/sale');
const SaleDetail = require('../models/saleDetail');
const Product = require('../models/products'); // Nombre del archivo correcto

const Service = require('../models/service');
const User = require('../models/User');
const Appointment = require('../models/appointment');
const productRepository = require('./productsRepository');
const sequelize = require('../config/database');

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
                    model: User, // Asegúrate de que este alias coincide con el definido en las asociaciones
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
    const transaction = await sequelize.transaction();

    try {
        const saleId = appointmentData
            ? Math.floor(100 + Math.random() * 900)
            : (await Sale.findOne({ order: [['id', 'DESC']], transaction }))?.id + 1 || 1;

        const createdSale = await Sale.create({
            ...sale,
            id: saleId
        }, { transaction });

        let createdAppointment = null;
        if (appointmentData) {
            createdAppointment = await Appointment.create({
                id: saleId,
                Init_Time: appointmentData.Init_Time,
                Finish_Time: appointmentData.Finish_Time,
                Date: appointmentData.Date || sale.SaleDate,
                Total: sale.total_price,
                time_appointment: appointmentData.time_appointment,
                status: 'pendiente',
                clienteId: sale.id_usuario
            }, { transaction });
        }

        if (saleDetails && saleDetails.length > 0) {
            const detailsWithIds = saleDetails.map(detail => ({
                ...detail,
                id_sale: saleId,
                appointmentId: createdAppointment ? saleId : null
            }));

            await SaleDetail.bulkCreate(detailsWithIds, { transaction });

            const productDetails = detailsWithIds.filter(detail => detail.id_producto);
            if (productDetails.length > 0) {
                await productRepository.updateProductStock(productDetails, transaction);
            }
        }

        await transaction.commit();
        return {
            sale: createdSale,
            appointment: createdAppointment,
            message: createdAppointment
                ? 'Venta y cita creadas exitosamente'
                : 'Venta creada exitosamente'
        };
    } catch (error) {
        await transaction.rollback();
        console.error('Error en createSale:', error);
        throw error;
    }
};

const getSaleById = async (id) => {
    try {
        return await Sale.findByPk(id, {
            include: [
                {
                    model: SaleDetail,
                    include: [
                        {
                            model: Product,
                            attributes: ['name', 'price'],
                        },
                        {
                            model: Service,
                            attributes: ['name', 'price'],
                        },
                    ],
                },
            ],
        });
    } catch (error) {
        console.error('Error in getSaleById:', error);
        throw error;
    }
};

const getSaleAll = async () => {
    try {
        return await Sale.findAll({
            include: [
                {
                    model: SaleDetail,
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
                    ],
                },
                {
                    model: User,
                    attributes: ['name', 'email'],
                },
            ],
        });
    } catch (error) {
        console.error('Error in getSaleAll:', error);
        throw error;
    }
};

const updateStatusSales = async (id, newStatus) => {
    const transaction = await sequelize.transaction();
    try {
        const [updatedSaleRows] = await Sale.update(
            { status: newStatus },
            { where: { id }, transaction }
        );

        if (updatedSaleRows === 0) {
            await transaction.rollback();
            throw new Error('Venta no encontrada');
        }

        const [updatedAppointmentRows] = await Appointment.update(
            { status: newStatus },
            { where: { id }, transaction }
        );

        await transaction.commit();

        const message = updatedAppointmentRows > 0
            ? 'Estado de la venta y cita asociada actualizados correctamente'
            : 'Estado de la venta actualizado correctamente';

        return { message, updatedSale: true, updatedAppointment: updatedAppointmentRows > 0 };
    } catch (error) {
        await transaction.rollback();
        console.error('Error al actualizar el estado de la venta:', error);
        throw error;
    }
};

const cancelSale = async (id, transaction = null) => {
    try {
        const sale = await Sale.findByPk(id, {
            include: [SaleDetail],
            transaction,
        });

        if (!sale) {
            throw new Error('Venta no encontrada');
        }

        if (sale.status === 'Cancelada') {
            throw new Error('Esta venta ya está cancelada');
        }

        sale.status = 'Cancelada';

        const saleDetails = sale.SaleDetails;
        for (const detail of saleDetails) {
            if (detail.id_producto) {
                await productRepository.updateProductStockForAnulatedSales([
                    { product_id: detail.id_producto, quantity: detail.quantity }
                ], transaction);
            }
        }

        await sale.save({ transaction });
    } catch (error) {
        console.error('Error al cancelar la venta:', error);
        throw error;
    }
};

module.exports = {
    createSale,
    getSaleById,
    getSaleAll,
    updateStatusSales,
    cancelSale,
    getSaleDetailsByAppointmentId,
};