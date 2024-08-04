const { models } = require('../models');

const getAllabsences = async () => {
    return await models.Absence.findAll();
};

const getAbsenceById = async (id) => {
    return await models.Absence.findByPk(id);
};

const createAbsence = async (data) => {
    return await models.Absence.create(data);
};

const updateAbsence = async (id, data) => {
    return await models.Absence.update(data, {
        where: { id }
    });
};

const deleteAbsence = async (id) => {
    return await models.Absence.destroy({
        where: { id }
    });
};

module.exports = {
    getAllabsences,
    getAbsenceById,
    createAbsence,
    updateAbsence,
    deleteAbsence
};

