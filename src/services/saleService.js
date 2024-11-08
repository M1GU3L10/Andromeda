const Sale = require('../models/sale');
const SaleDetail = require('../models/saleDetail');
const Appointment = require('../models/appointment');
const productRepository = require('../repositories/productsRepository');
const sequelize = require('../config/database');
const { models } = require('../models');

const createSale = async (saleData) => {
  const { saleDetails, appointmentData, ...sale } = saleData;
  const transaction = await sequelize.transaction();

  try {
    // 1. Crear la venta principal
    const createdSale = await models.Sale.create({ // Modificar esta línea
      Billnumber: sale.Billnumber,
      SaleDate: sale.SaleDate,
      total_price: sale.total_price,
      status: sale.status,
      id_usuario: sale.id_usuario
    }, {
      transaction
    });

    let createdAppointment = null;
    const hasServices = saleDetails.some(detail => detail.serviceId);

    if (hasServices && appointmentData) {
      createdAppointment = await models.appointment.create({ // Modificar esta línea
        Init_Time: appointmentData.Init_Time,
        Finish_Time: appointmentData.Finish_Time,
        Date: appointmentData.Date,
        time_appointment: appointmentData.time_appointment,
        status: 'Pendiente',
        Total: sale.total_price,
        clienteId: sale.id_usuario
      }, {
        transaction
      });
    }

    if (saleDetails && saleDetails.length > 0) {
      const detailsWithIds = saleDetails.map(detail => ({
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        total_price: detail.total_price,
        id_producto: detail.id_producto || null,
        serviceId: detail.serviceId || null,
        empleadoId: detail.empleadoId,
        id_sale: createdSale.id,
        appointmentId: hasServices ? createdAppointment?.id : null
      }));

      await models.Detail.bulkCreate(detailsWithIds, { // Modificar esta línea
        transaction
      });

      const productDetails = detailsWithIds.filter(detail => detail.id_producto);
      if (productDetails.length > 0) {
        await productRepository.updateProductStock(productDetails, transaction);
      }
    }

    await transaction.commit();

    return {
      sale: createdSale,
      appointment: createdAppointment,
      message: hasServices
        ? 'Venta y cita creadas exitosamente'
        : 'Venta creada exitosamente'
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getSaleById = async (id) => {
  return await saleRepository.getSaleById(id);
};

const getSaleAll = async () => {
  return await saleRepository.getSaleAll();
};

const updateStatusSales = async (id, status) => {
  return await saleRepository.updateStatusSales(id, status);
};

module.exports = {
  createSale,
  getSaleById,
  getSaleAll,
  updateStatusSales
};