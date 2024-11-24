// services/privilegiosService.js
const privilegeRepository = require('../repositories/privilegiosRepository');
const privilegePermissionRoleRepository = require('../repositories/privilegePermissionRoleRepository');

const getAllPrivileges = async () => {
    return await privilegeRepository.getAllPrivileges();
};

const getPrivilegeById = async (id) => {
    return await privilegeRepository.getPrivilegeById(id);
};

const createPrivilege = async (data) => {
    return await privilegeRepository.createPrivilege(data);
};

const updatePrivilege = async (id, data) => {
    return await privilegeRepository.updatePrivilege(id, data);
};

const deletePrivilege = async (id) => {
    return await privilegeRepository.deletePrivilege(id);
};

const createMultiplePrivileges = async (privilegesData) => {
    return await privilegeRepository.createMultiplePrivileges(privilegesData);
};

const assignPrivilegeToPermissionRole = async (privilegeId, permissionRoleId) => {
    return await privilegePermissionRoleRepository.createPrivilegePermissionRole({
        privilegeId,
        permissionRoleId
    });
};

module.exports = {
    getAllPrivileges,
    getPrivilegeById,
    createPrivilege,
    updatePrivilege,
    deletePrivilege,
    createMultiplePrivileges,
    assignPrivilegeToPermissionRole
};