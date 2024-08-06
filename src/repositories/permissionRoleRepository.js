const { models } = require('../models');

const getAllPermissionsRoles = async () => {
    return await models.PermissionRole.findAll();
};

const getPermissionRoleById = async (id) => {
    return await models.PermissionRole.findByPk(id);
};

const createPermissionRole = async (data) => {
    return await models.PermissionRole.create(data);
};

const updatePermissionRole = async (id, data) => {
    return await models.PermissionRole.update(data, {
        where: { id }
    });
};

const deletePermissionRole = async (id) => {
    return await models.PermissionRole.destroy({
        where: { id }
    });
};

module.exports = {
    getAllPermissionsRoles,
    getPermissionRoleById,
    createPermissionRole,
    updatePermissionRole,
    deletePermissionRole
};

