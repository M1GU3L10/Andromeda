const { models } = require('../models');

const getAllPrivilegePermissionRoles = async () => {
    return await models.PrivilegePermissionRole.findAll({
        include: [models.PermissionRole, models.Privilege]
    });
};

const getPrivilegePermissionRoleById = async (id) => {
    return await models.PrivilegePermissionRole.findByPk(id, {
        include: [models.PermissionRole, models.Privilege]
    });
};

const createPrivilegePermissionRole = async (data) => {
    return await models.PrivilegePermissionRole.create(data);
};

const updatePrivilegePermissionRole = async (id, data) => {
    return await models.PrivilegePermissionRole.update(data, {
        where: { id }
    });
};

const deletePrivilegePermissionRole = async (id) => {
    return await models.PrivilegePermissionRole.destroy({
        where: { id }
    });
};

module.exports = {
    getAllPrivilegePermissionRoles,
    getPrivilegePermissionRoleById,
    createPrivilegePermissionRole,
    updatePrivilegePermissionRole,
    deletePrivilegePermissionRole
};