const { models } = require('../models');

const getAllServices = async () => {
    return await models.Service.findAll();
};

const getServiceById = async (id) => {
    return await models.Service.findByPk(id);
};

const createService = async (data) => {
    return await models.Service.create(data);
};

const updateService = async (id, data) => {
    return await models.Service.update(data, {
        where: { id }
    });
};

const deleteService = async (id) => {
    return await models.Service.destroy({
        where: { id }
    });
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};

