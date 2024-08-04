const roleRepository = require('../repositories/roleRepository');

const getAllRoles = async () => {
    return await roleRepository.getAllRoles();
};

const getRoleById = async (id) => {
    return await roleRepository.getRoleById(id);
};

const createRole = async (data) => {
    return await roleRepository.createRole(data);
};

const updateRole = async (id, data) => {
    return await roleRepository.updateRole(id, data);
};

const deleteRole = async (id) => {
    return await roleRepository.deleteRole(id);
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};

