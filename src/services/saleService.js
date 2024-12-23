const Sale = require('../models/sale');
const SaleDetail = require('../models/saleDetail');
const Appointment = require('../models/appointment');
const productRepository = require('../repositories/productsRepository');
const sequelize = require('../config/database');
const { models } = require('../models');
const saleRepository = require('../repositories/saleRepository')

const getSaleDetailsByAppointmentId = async (appointmentId) => {
  try {
    const saleDetails = await saleRepository.getSaleDetailsByAppointmentId(appointmentId);

    if (!saleDetails || saleDetails.length === 0) {
      return [];
    }

    return saleDetails.map((detail) => ({
      id: detail.id,
      quantity: detail.quantity,
      price: detail.unitPrice,
      total: detail.total_price,
      type: detail.Product ? 'Product' : 'Service',
      name: detail.Product ? detail.Product.name : (detail.Service ? detail.Service.name : 'Unknown'),
      employeeName: detail.Employee ? detail.Employee.name : null,
      saleInfo: detail.Sale ? {
        billNumber: detail.Sale.Billnumber,
        saleDate: detail.Sale.SaleDate,
        totalPrice: detail.Sale.total_price,
        clientName: detail.Sale.User ? detail.Sale.User.name : 'Unknown',
        clientEmail: detail.Sale.User ? detail.Sale.User.email : 'Unknown',
      } : null,
    }));
  } catch (error) {
    console.error('Error fetching sale details by appointmentId:', error);
    throw new Error('Failed to fetch sale details');
  }
};


const createSale = async (saleData) => {
  const { saleDetails, appointmentData, ...sale } = saleData;
  const transaction = await sequelize.transaction();

  try {
    const hasServices = saleDetails.some(detail => detail.serviceId);

    // Generar un número aleatorio de tres dígitos para el ID
    const saleId = hasServices && appointmentData
      ? Math.floor(100 + Math.random() * 900)
      : null;

    // Crear la venta con el ID generado o el secuencial
    const createdSale = await models.Sale.create({
      id: saleId || undefined,
      Billnumber: sale.Billnumber,
      SaleDate: sale.SaleDate,
      total_price: sale.total_price,
      status: sale.status,
      id_usuario: sale.id_usuario
    }, { transaction });

    let createdAppointment = null;
    if (hasServices && appointmentData) {
      createdAppointment = await models.Appointment.create({
        id: createdSale.id, // Usar el ID de la venta
        Init_Time: appointmentData.Init_Time,
        Finish_Time: appointmentData.Finish_Time,
        Date: appointmentData.Date,
        time_appointment: appointmentData.time_appointment,
        status: 'Pendiente',
        Total: sale.total_price,
        clienteId: sale.id_usuario
      }, { transaction });
    }

    if (saleDetails.length > 0) {
      const detailsWithIds = saleDetails.map(detail => ({
        ...detail,
        id_sale: createdSale.id,
        appointmentId: hasServices ? createdAppointment?.id : null
      }));

      await models.SaleDetail.bulkCreate(detailsWithIds, { transaction });

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


const createSaleFromOrder = async (saleData) => {
  const transaction = await sequelize.transaction();

  try {
    const createdSale = await models.Sale.create({
      Billnumber: saleData.Billnumber,
      SaleDate: saleData.SaleDate,
      total_price: saleData.total_price,
      status: saleData.status,
      id_usuario: saleData.id_usuario
    }, {
      transaction
    });

    if (saleData.saleDetails && saleData.saleDetails.length > 0) {
      const detailsWithIds = saleData.saleDetails.map(detail => ({
        ...detail,
        id_sale: createdSale.id
      }));

      await models.SaleDetail.bulkCreate(detailsWithIds, {
        transaction
      });
    }

    await transaction.commit();

    return {
      sale: createdSale,
      message: 'Venta creada exitosamente a partir de la orden'
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getSaleById = async (id) => {
  return await models.Sale.findByPk(id, { include: [models.SaleDetail] });
};

const getSaleAll = async () => {
  return await models.Sale.findAll({
    include: [models.SaleDetail]
  });
};

const updateSaleStatus = async (id, newStatus) => {
  try {
    const result = await saleRepository.updateStatusSales(id, newStatus);
    return result;
  } catch (error) {
    console.error('Error en el servicio al actualizar el estado de la venta:', error);
    throw error;
  }
};

const cancelSale = async (id) => {
  const transaction = await sequelize.transaction();
  try {
      await saleRepository.cancelSale(id, transaction);
      await transaction.commit();
  } catch (error) {
      await transaction.rollback();
      throw error;
  }
};

module.exports = {
  cancelSale,
  createSale,
  createSaleFromOrder,
  getSaleById,
  getSaleAll,
  updateSaleStatus,
  getSaleDetailsByAppointmentId
};