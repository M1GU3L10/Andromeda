const { models } = require('../models');

const getAllabsences = async () => {
    return await models.appointment.findAll();
};

const getAbsenceById = async (id) => {
    return await models.appointment.findByPk(id);
};


module.exports = {
    getAllabsences,
    getAbsenceById
};

