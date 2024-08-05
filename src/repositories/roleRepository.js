const { models } = require('../models');

const getAllRoles = async () => {
    return await models.Role.findAll();
};

const getRoleById = async (id) => {
    return await models.Role.findByPk(id);
};

const createRole = async (data) => {
    return await models.Role.create(data);
};

const updateRole = async (id, data) => {
    return await models.Role.update(data, {
        where: { id }
    });
};

const deleteRole = async (id) => {
    return await models.Role.destroy({
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

