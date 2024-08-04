const { models } = require('../models');

const getAllSuppliers = async () => {
    return await models.Supplier.findAll();
};

const getSupplierById = async (id) => {
    return await models.Supplier.findByPk(id);
};

const createSupplier = async (data) => {
    return await models.Supplier.create(data);
};

const updateSupplier = async (id, data) => {
    return await models.Supplier.update(data, {
        where: { id }
    });
};

const deleteSupplier = async (id) => {
    return await models.Supplier.destroy({
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
