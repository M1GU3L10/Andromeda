const privilegeRepository = require('../repositories/privilegiosRepository');

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

module.exports = {
    getAllPrivileges,
    getPrivilegeById,
    createPrivilege,
    updatePrivilege,
    deletePrivilege,
    createMultiplePrivileges
};