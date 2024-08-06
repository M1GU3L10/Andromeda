const { models } = require('../models');

const getAllSuppliers = async () => {
    return await models.supplier.findAll();
};

const getSupplierById = async (id) => {
    return await models.supplier.findByPk(id);
};

const createSupplier = async (data) => {
    return await models.supplier.create(data);
};

const updateSupplier = async (id, data) => {
    return await models.supplier.update(data, {
        where: { id }
    });
};

const deleteSupplier = async (id) => {
    return await models.supplier.destroy({
        where: { id }
    });
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
