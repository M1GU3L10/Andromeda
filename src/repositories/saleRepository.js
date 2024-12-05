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
    const transaction = await sequelize.transaction();

    try {
        // Generar un número aleatorio de tres dígitos
        const sharedId = Math.floor(100 + Math.random() * 900);

        console.log(`ID generado para la venta y cita: ${sharedId}`);

        // 1. Crear la venta principal con el ID generado
        const createdSale = await Sale.create({
            ...sale,
            id: sharedId,
            registrationDate: new Date().toISOString().split('T')[0] // Añadir fecha de registro
        }, { transaction });

        console.log(`Venta creada con ID: ${createdSale.id}`);

        let createdAppointment = null;
        if (appointmentData) {
            // Crear la cita usando el mismo ID que la venta
            createdAppointment = await Appointment.create({
                ...appointmentData,
                id: sharedId,
                Total: sale.total_price,
                status: 'Pendiente',
                clienteId: sale.id_usuario
            }, { transaction });

            console.log(`Cita creada con ID: ${createdAppointment.id}`);
        }

        // 3. Crear los detalles de venta
        if (saleDetails && saleDetails.length > 0) {
            const detailsWithIds = saleDetails.map(detail => ({
                ...detail,
                id_sale: sharedId,
                appointmentId: createdAppointment ? sharedId : null
            }));

            await SaleDetail.bulkCreate(detailsWithIds, { transaction });

            // 4. Actualizar el stock solo para los productos (no servicios)
            const productDetails = detailsWithIds.filter(detail => detail.id_producto);
            if (productDetails.length > 0) {
                await productRepository.updateProductStock(productDetails, transaction);
            }
        }

        await transaction.commit();

        // Formatear la respuesta
        const response = {
            sale: {
                id: createdSale.id,
                Billnumber: createdSale.Billnumber,
                SaleDate: createdSale.SaleDate,
                total_price: createdSale.total_price,
                status: createdSale.status,
                id_usuario: createdSale.id_usuario,
                updatedAt: createdSale.updatedAt,
                createdAt: createdSale.createdAt,
                registrationDate: createdSale.registrationDate
            },
            message: createdAppointment ? 'Venta y cita creadas exitosamente' : 'Venta creada exitosamente'
        };

        if (createdAppointment) {
            response.appointment = {
                id: createdAppointment.id,
                Init_Time: createdAppointment.Init_Time,
                Finish_Time: createdAppointment.Finish_Time,
                Date: createdAppointment.Date,
                Total: createdAppointment.Total,
                time_appointment: createdAppointment.time_appointment,
                status: createdAppointment.status,
                clienteId: createdAppointment.clienteId,
                updatedAt: createdAppointment.updatedAt,
                createdAt: createdAppointment.createdAt
            };
        }

        return response;

    } catch (error) {
        await transaction.rollback();
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
                model: SaleDetail,
                include: [
                    {
                        model: models.Product,
                        attributes: ['name', 'price'],
                    },
                    {
                        model: models.Service,
                        attributes: ['name', 'price'],
                    },
                    {
                        model: models.User,
                        as: 'Employee',
                        attributes: ['name'],
                    },
                    {
                        model: models.appointment,
                        required: false
                    }
                ]
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
        const [updatedAppointmentRows] = await models.appointment.update(
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


module.exports = {
    createSale,
    getSaleById,
    getSaleAll,
    updateStatusSales,
    getSaleDetailsByAppointmentId
};