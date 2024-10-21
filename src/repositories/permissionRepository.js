const { models } = require('../models');

const getAllPermissions = async () => {
    return await models.Permission.findAll();
};

const getPermissionById = async (id) => {
    return await models.Permission.findByPk(id);
};

const createPermission = async (data) => {
    if (Array.isArray(data)) {
        return await models.Permission.bulkCreate(data, { ignoreDuplicates: true });
    }
    return await models.Permission.create(data);
};




const updatePermission = async (id, data) => {
    return await models.Permission.update(data, {
        where: { id }
    });
};

const deletePermission = async (id) => {
    return await models.Permission.destroy({
        where: { id }
    });
};

module.exports = {
    getAllPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission
};

