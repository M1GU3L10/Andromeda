const { models } = require('../models');

const getAllProgrammingemployees = async () => {
    return await models.Programmingemployees.findAll();
};

const getProgrammingemployeesById = async (id) => {
    return await models.Programmingemployees.findByPk(id);
};

const createProgrammingemployees = async (data) => {
    return await models.Programmingemployees.create(data);
};

const updateProgrammingemployees = async (id, data) => {
    return await models.Programmingemployees.update(data, {
        where: { id }
    });
};

const deleteProgrammingemployees = async (id) => {
    return await models.Programmingemployees.destroy({
        where: { id }
    });
};

module.exports = {
    getAllProgrammingemployees,
    getProgrammingemployeesById,
    createProgrammingemployees,
    updateProgrammingemployees,
    deleteProgrammingemployees
};

