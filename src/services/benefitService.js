const serviceRepository = require('../repositories/serviceRepository');

const getAllServices = async () => {
    return await serviceRepository.getAllServices();
};

const getServiceById = async (id) => {
    return await serviceRepository.getServiceById(id);
};

const createService = async (data) => {
    return await serviceRepository.createService(data);
};

const updateService = async (id, data) => {
    return await serviceRepository.updateService(id, data);
};

const deleteService = async (id) => {
    return await serviceRepository.deleteService(id);
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};

