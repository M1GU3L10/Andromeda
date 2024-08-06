const permissionRoleRepository = require('../repositories/permissionRoleRepository');

const getAllPermissionsRoles = async () => {
    return await permissionRoleRepository.getAllPermissionsRoles();
};

const getPermissionRoleById = async (id) => {
    return await permissionRoleRepository.getPermissionRoleById(id);
};

const createPermissionRole = async (data) => {
    return await permissionRoleRepository.createPermissionRole(data);
};

const updatePermissionRole = async (id, data) => {
    return await permissionRoleRepository.updatePermissionRole(id, data);
};

const deletePermissionRole = async (id) => {
    return await permissionRoleRepository.deletePermissionRole(id);
};

module.exports = {
    getAllPermissionsRoles,
    getPermissionRoleById,
    createPermissionRole,
    updatePermissionRole,
    deletePermissionRole
};

