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

const updateStatusSales = async (id, status) => {
    return await models.Sale.update(status, {
        where: { id }
    });
};



module.exports = {
    createSale,
    getSaleById,
    getSaleAll,
    updateStatusSales,
    getSaleDetailsByAppointmentId
};