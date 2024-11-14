const permissionRepository = require('../repositories/permissionRepository');

const getAllPermissions = async () => {
    return await permissionRepository.getAllPermissions();
};

const getPermissionById = async (id) => {
    return await permissionRepository.getPermissionById(id);
};

const createPermission = async (data) => {
    return await permissionRepository.createPermission(data);
};

const createMultiplePermissions = async (permissionsData) => {
    return await permissionRepository.createPermission(permissionsData);
  };
  
const updatePermission = async (id, data) => {
    return await permissionRepository.updatePermission(id, data);
};

const deletePermission = async (id) => {
    return await permissionRepository.deletePermission(id);
};

module.exports = {
    getAllPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    createMultiplePermissions
};

