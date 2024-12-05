const sequelize = require('../config/database');
const { models } = require('../models');


const getAllAppointments = async () => {
    return await models.appointment.findAll();
};

const getAppointmentById = async (id) => {
  try {
    return await models.appointment.findOne({
      where: { id },
      include: [
        {
          model: models.User,
          attributes: ['name', 'email']
        }
      ]
    });
  } catch (error) {
    console.error('Error in getAppointmentById repository:', error);
    throw error;
  }
};

const updateStatusAppointment = async (id, status) => {
  const transaction = await sequelize.transaction();
  try {
    if (!transaction) {
      throw new Error("Failed to initialize transaction.");
    }

    // 1. Actualizar el estado de la cita
    const [updatedAppointmentCount] = await models.appointment.update(
      { status },
      {
        where: { id },
        transaction
      }
    );

    if (updatedAppointmentCount === 0) {
      throw new Error('Cita no encontrada');
    }

    // 2. Intentar actualizar la venta asociada (si existe)
    const [updatedSaleCount] = await models.Sale.update(
      { status },
      {
        where: { id },
        transaction
      }
    );

    // 3. Confirmar la transacción
    await transaction.commit();

    // 4. Preparar el mensaje de respuesta
    const message = updatedSaleCount > 0
      ? 'Estado de la cita y venta asociada actualizados correctamente'
      : 'Estado de la cita actualizado correctamente';

    return {
      message,
      updatedAppointment: true,
      updatedSale: updatedSaleCount > 0
    };
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error al actualizar el estado de la cita:', error);
    throw error;
  }
};

const getSaleDetailsByAppointmentId = async (appointmentId) => {
  try {
    return await models.Detail.findAll({
      where: { appointmentId },
      include: [
        {
          model: models.Product,
          attributes: ['Product_Name', 'price']
        },
        {
          model: models.Service,
          attributes: ['name', 'price']
        },
        {
          model: models.User,
          as: 'Employee',
          attributes: ['name']
        },
        {
          model: models.Sale,
          attributes: ['Billnumber', 'status', 'id_usuario'],
          include: [
            {
              model: models.User,
              attributes: ['name', 'email']
            }
          ]
        }
      ],
      attributes: ['id', 'quantity', 'unitPrice', 'total_price', 'id_producto', 'serviceId', 'empleadoId']
    });
  } catch (error) {
    console.error('Error in getSaleDetailsByAppointmentId repository:', error);
    throw error;
  }
  };

  const getSaleDetailByAppointmentId = async (appointmentId) => {
    return await models.Detail.findOne({
        where: { appointmentId }
    });
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    updateStatusAppointment,
    getSaleDetailsByAppointmentId,
    getSaleDetailByAppointmentId
};