const appointmentRepository = require('../repositories/appointment');
const saleRepository = require('../repositories/saleRepository');

const getAllAppointments = async () => {
  return await appointmentRepository.getAllAppointments();
};

const getAppointmentById = async (id) => {
  return await appointmentRepository.getAppointmentById(id);
};

const updateStatusAppointment = async (appointmentId, status) => {
  try {
    const result = await appointmentRepository.updateStatusAppointment(appointmentId, status);

    if (!result) {
      throw new Error("Failed to update appointment status.");
    }

    // Retrieve associated sale detail by appointment ID
    const saleDetail = await appointmentRepository.getSaleDetailByAppointmentId(appointmentId);
    if (saleDetail) {
      await saleRepository.updateStatusSales(saleDetail.id_sale, { status });
    }

    return result;
  } catch (error) {
    console.error('Error en el servicio al actualizar el estado:', error.message);
    throw new Error('No se pudo actualizar el estado de la cita y la venta asociada');
  }
};

const getAppointmentWithDetails = async(appointmentId) =>{
  try {
    const appointment = await appointmentRepository.getAppointmentById(appointmentId);
    
    if (!appointment) {
      return null;
    }

    return {
      id: appointment.id,
      clientName: appointment.User?.name || 'Unknown',
      clientEmail: appointment.User?.email,
      Init_Time: appointment.Init_Time,
      Finish_Time: appointment.Finish_Time,
      Date: appointment.Date,
      Total: appointment.Total,
      status: appointment.status,
      time_appointment: appointment.time_appointment
    };
  } catch (error) {
    console.error('Error in getAppointmentWithDetails service:', error);
    throw error;
  }
}

const getSaleDetailsByAppointmentId = async (appointmentId) => {
  try {
    const saleDetails = await appointmentRepository.getSaleDetailsByAppointmentId(appointmentId);
    
    if (!saleDetails || saleDetails.length === 0) {
      return [];
    }

    return saleDetails.map(detail => ({
      id: detail.id,
      type: detail.Product ? 'Product' : 'Service',
      name: detail.Product?.name || detail.Service?.name || 'Unknown',
      quantity: detail.quantity,
      price: detail.unitPrice,
      total: detail.total_price,
      employeeName: detail.Employee?.name || null,
      saleInfo: {
        billNumber: detail.Sale?.Billnumber,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        id_producto: detail.id_producto,
        empleadoId: detail.empleadoId,
        status: detail.Sale?.status,
        id_usuario: detail.Sale?.id_usuario
      }
    }));
  } catch (error) {
    console.error('Error in getSaleDetailsByAppointmentId service:', error);
    throw error;
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  updateStatusAppointment,
  getSaleDetailsByAppointmentId,
  getAppointmentWithDetails
};
