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

    return result;
  } catch (error) {
    console.error('Error en el servicio al actualizar el estado:', error.message);
    throw error; // Propaga el error original en lugar de crear uno nuevo
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
      type: detail.Product ? 'Producto' : 'Servicio',
      name: detail.Product?.Product_Name || detail.Service?.name || 'Unknown',
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
        id_usuario: detail.Sale?.id_usuario,
        serviceId:detail.serviceId
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
