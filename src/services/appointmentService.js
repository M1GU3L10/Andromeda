const appointmentRepository = require('../repositories/appointment');

const getAllAbsences = async () => {
    return await appointmentRepository.getAllabsences();
};

const getAbsenceById = async (id) => {
    return await appointmentRepository.getAbsenceById(id);
};


module.exports = {
    getAllAbsences,
    getAbsenceById
};

