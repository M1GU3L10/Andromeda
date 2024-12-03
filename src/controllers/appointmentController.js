const appointmentService = require('../services/appointmentService');
const { sendResponse, sendError } = require('../utils/response');

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await appointmentService.getAllAppointments();
        sendResponse(res, appointments);
    } catch (error) {
        sendError(res, 'Error al obtener las citas', 500);
    }
};

const getAppointmentById = async (req, res) => {
    try {
        const appointment = await appointmentService.getAppointmentById(req.params.id);
        if (!appointment) {
            return sendError(res, 'Cita no encontrada', 404);
        }
        sendResponse(res, appointment);
    } catch (error) {
        sendError(res, 'Error al obtener la cita', 500);
    }
};

const updateStatusAppointment = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return sendError(res, 'El estado de la cita es requerido', 400);
        }

        const result = await appointmentService.updateStatusAppointment(req.params.id, status);
        sendResponse(res, result);
    } catch (error) {
        console.error('Error en el controlador al actualizar el estado:', error.message);
        sendError(res, error.message || 'Error al actualizar el estado de la cita y la venta', 500);
    }
};

const getAppointmentWithDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const appointmentDetails = await appointmentService.getAppointmentWithDetails(id);
      
      if (!appointmentDetails) {
        return res.status(404).json({ 
          success: false, 
          message: 'Appointment not found' 
        });
      }
      
      res.json({
        success: true,
        data: appointmentDetails
      });
    } catch (error) {
      console.error('Error in getAppointmentWithDetails:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching appointment details',
        error: error.message 
      });
    }
  }


const getSaleDetailsByAppointmentId = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const saleDetails = await appointmentService.getSaleDetailsByAppointmentId(appointmentId);
        
        if (!saleDetails || saleDetails.length === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'No sale details found for this appointment' 
          });
        }
        
        res.json({
          success: true,
          data: saleDetails
        });
      } catch (error) {
        console.error('Error in getSaleDetailsByAppointmentId:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Error fetching sale details',
          error: error.message 
        });
      }
  };
  

module.exports = {
    getAllAppointments,
    getAppointmentById,
    updateStatusAppointment,
    getSaleDetailsByAppointmentId,
    getAppointmentWithDetails
};
