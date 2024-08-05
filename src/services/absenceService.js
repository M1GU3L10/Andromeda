const absenceRepository = require('../repositories/absenceRepository');

const getAllAbsences = async () => {
    return await absenceRepository.getAllabsences();
};

const getAbsenceById = async (id) => {
    return await absenceRepository.getAbsenceById(id);
};

const createAbsence = async (data) => {
    return await absenceRepository.createAbsence(data);
};

const updateAbsence = async (id, data) => {
    return await absenceRepository.updateAbsence(id, data);
};

const deleteAbsence = async (id) => {
    return await absenceRepository.deleteAbsence(id);
};

module.exports = {
    getAllAbsences,
    getAbsenceById,
    createAbsence,
    updateAbsence,
    deleteAbsence
};

