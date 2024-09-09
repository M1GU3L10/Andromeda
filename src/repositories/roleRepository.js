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

const updateRole = async (id, data, permissions) => {
    const role = await models.Role.findByPk(id);
    if (!role) return null;
    await role.update(data);
    if (permissions) {
        await role.setPermissions(permissions); // Asegúrate de que `permissions` sea un array de IDs de permisos
    }
    return role;
};

const deleteRole = async (id) => {
    // Primero, eliminar las asociaciones en la tabla intermedia
    await PermissionRole.destroy({
        where: { roleId: id }
    });

    // Luego, eliminar el rol
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
