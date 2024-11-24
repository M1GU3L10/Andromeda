const { models } = require('../models');

const getAllPrivileges = async () => {
    return await models.Privilege.findAll();
};

const getPrivilegeById = async (id) => {
    return await models.Privilege.findByPk(id);
};

const createPrivilege = async (data) => {
    return await models.Privilege.create(data);
};

const updatePrivilege = async (id, data) => {
    return await models.Privilege.update(data, {
        where: { id }
    });
};

const deletePrivilege = async (id) => {
    return await models.Privilege.destroy({
        where: { id }
    });
};

const createMultiplePrivileges = async (privilegesData) => {
    return await models.Privilege.bulkCreate(privilegesData);
};

module.exports = {
    getAllPrivileges,
    getPrivilegeById,
    createPrivilege,
    updatePrivilege,
    deletePrivilege,
    createMultiplePrivileges
};