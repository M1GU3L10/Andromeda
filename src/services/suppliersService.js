const supplierRepository = require('../repositories/suppliersRepository');

const getAllSuppliers = async () => {
    return await supplierRepository.getAllSuppliers();
};

const getSupplierById = async (id) => {
    return await supplierRepository.getSupplierById(id);
};

const createSupplier = async (data) => {
    return await supplierRepository.createSupplier(data);
};

const updateSupplier = async (id, data) => {
    return await supplierRepository.updateSupplier(id, data);
};

const deleteSupplier = async (id) => {
    return await supplierRepository.deleteSupplier(id);
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
