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
    const Transaction = await sequelize.transaction();
    try {
        if (!Transaction) {
            throw new Error("Failed to initialize transaction.");
        }

        const [updatedAppointmentCount] = await models.appointment.update(
            { status },
            {
                where: { id },
                transaction: Transaction
            }
        );

        if (updatedAppointmentCount === 0) {
            throw new Error('Cita no encontrada');
        }

        await Transaction.commit();
        return { message: 'Estado de la cita actualizado correctamente' };
    } catch (error) {
        if (Transaction) await Transaction.rollback();
        console.error('Error en el repositorio al actualizar el estado:', error.message);
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

module.exports = {
    getAllAppointments,
    getAppointmentById,
    updateStatusAppointment,
    getSaleDetailsByAppointmentId
};