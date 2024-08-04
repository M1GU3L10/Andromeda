const { models } = require('../models');

const getAllRoles = async () => {
    return await models.role.findAll();
};

const getRoleById = async (id) => {
    return await models.role.findByPk(id);
};

const createRole = async (data) => {
    return await models.role.create(data);
};

const updateRole = async (id, data) => {
    return await models.role.update(data, {
        where: { id }
    });
};

const deleteRole = async (id) => {
    return await models.Category.destroy({
        where: { id }
    });
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};

