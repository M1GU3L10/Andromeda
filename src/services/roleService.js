const roleRepository = require('../repositories/roleRepository');

const getAllRoles = async () => {
    return await roleRepository.getAllRoles();
};

const getRoleById = async (id) => {
    return await roleRepository.getRoleById(id);
};

const createRole = async (data, permissions) => {
    const role = await roleRepository.createRole(data);
    if (permissions) {
        await role.setPermissions(permissions); // Asegúrate de que `permissions` sea un array de IDs de permisos
    }
    return role;
};

const updateRole = async (id, data, permissions) => {
    return await roleRepository.updateRole(id, data, permissions);
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