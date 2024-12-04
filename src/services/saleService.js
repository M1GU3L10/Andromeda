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
    const createdSale = await models.Sale.create({
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
      createdAppointment = await models.appointment.create({
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

      await models.Detail.bulkCreate(detailsWithIds, {
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

      await models.Detail.bulkCreate(detailsWithIds, {
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
  return await models.Sale.findByPk(id, { include: [models.Detail] });
};

const getSaleAll = async () => {
  return await models.Sale.findAll({
    include: [models.Detail]
  });
};

const updateStatusSales = async (id, newStatus) => {
  const transaction = await sequelize.transaction();
  try {
    // 1. Actualizar el estado de la venta
    const [updatedRows] = await models.Sale.update({ status: newStatus }, {
      where: { id },
      transaction
    });

    if (updatedRows === 0) {
      await transaction.rollback();
      throw new Error('Venta no encontrada');
    }

    // 2. Buscar los detalles de la venta
    const saleDetails = await models.Detail.findAll({
      where: { id_sale: id },
      include: [
        {
          model: models.Service,
          required: false
        }
      ],
      transaction
    });

    let updatedAppointment = false;

    // 3. Si hay detalles con servicios, buscar y actualizar la cita asociada
    for (const detail of saleDetails) {
      if (detail.Service) {
        const appointment = await models.appointment.findOne({
          where: {
            [sequelize.Op.or]: [
              { id: detail.appointmentId },
              { '$Details.id$': detail.id }
            ]
          },
          include: [{
            model: models.Detail,
            required: false
          }],
          transaction
        });

        if (appointment) {
          await appointment.update({ status: newStatus }, { transaction });
          updatedAppointment = true;
          break; // Asumimos que solo hay una cita por venta
        }
      }
    }

    // 4. Confirmar la transacción
    await transaction.commit();
    
    return { 
      message: updatedAppointment 
        ? 'Estado de la venta y cita asociada actualizados correctamente'
        : 'Estado de la venta actualizado correctamente',
      updatedAppointment
    };
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar el estado de la venta:', error);
    throw error;
  }
};

module.exports = {
  createSale,
  createSaleFromOrder,
  getSaleById,
  getSaleAll,
  updateStatusSales,
  getSaleDetailsByAppointmentId
};