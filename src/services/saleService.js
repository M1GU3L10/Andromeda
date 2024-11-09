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

const updateSaleAppointment = async (saleId, appointmentId, updateData) => {
  let transaction;
  
  try {
      transaction = await sequelize.transaction();

      // 1. Verificar que la venta existe
      const sale = await models.Sale.findByPk(saleId, {
          include: [{
              model: models.Detail,
              where: { appointmentId: appointmentId },
              required: false
          }],
          transaction
      });

      if (!sale) {
          throw new Error('Venta no encontrada');
      }

      // 2. Verificar que la cita existe
      const appointment = await models.appointment.findByPk(appointmentId, {
          transaction
      });

      if (!appointment) {
          throw new Error('Cita no encontrada');
      }

      // 3. Actualizar la cita
      await models.appointment.update({
          Init_Time: updateData.appointmentData.Init_Time,
          Finish_Time: updateData.appointmentData.Finish_Time,
          Date: updateData.appointmentData.Date,
          time_appointment: updateData.appointmentData.time_appointment,
          status: updateData.appointmentData.status
      }, {
          where: { id: appointmentId },
          transaction
      });

      // 4. Si se proporcionan detalles de venta, actualizar el empleado
      if (updateData.saleDetails && updateData.saleDetails.length > 0) {
          const updatePromises = updateData.saleDetails.map(detail => {
              if (detail.id && detail.empleadoId) {
                  return models.Detail.update(
                      { empleadoId: detail.empleadoId },
                      {
                          where: { 
                              id: detail.id,
                              id_sale: saleId,
                              appointmentId: appointmentId
                          },
                          transaction
                      }
                  );
              }
              return Promise.resolve();
          });

          await Promise.all(updatePromises);
      }

      await transaction.commit();
      transaction = null; // Limpiar la referencia después del commit

      // 5. Obtener la información actualizada
      const updatedAppointment = await models.appointment.findByPk(appointmentId, {
          include: [{
              model: models.Detail,
          }]
      });

      return {
          message: 'Cita actualizada exitosamente',
          appointment: updatedAppointment
      };

  } catch (error) {
      // Solo hacer rollback si la transacción existe y no ha sido committed
      if (transaction) {
          await transaction.rollback();
      }
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