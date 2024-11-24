const privilegePermissionRoleRepository = require('../repositories/privilegePermissionRoleRepository');

const getAllPrivilegePermissionRoles = async () => {
    return await privilegePermissionRoleRepository.getAllPrivilegePermissionRoles();
};

const getPrivilegePermissionRoleById = async (id) => {
    return await privilegePermissionRoleRepository.getPrivilegePermissionRoleById(id);
};

const createPrivilegePermissionRole = async (data) => {
    return await privilegePermissionRoleRepository.createPrivilegePermissionRole(data);
};

const updatePrivilegePermissionRole = async (id, data) => {
    return await privilegePermissionRoleRepository.updatePrivilegePermissionRole(id, data);
};

const deletePrivilegePermissionRole = async (id) => {
    return await privilegePermissionRoleRepository.deletePrivilegePermissionRole(id);
};

module.exports = {
    getAllPrivilegePermissionRoles,
    getPrivilegePermissionRoleById,
    createPrivilegePermissionRole,
    updatePrivilegePermissionRole,
    deletePrivilegePermissionRole
};