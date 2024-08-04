const userRepository = require('../repositories/UserRepository');

const getAllUsers = async () => {
    return await userRepository.getAllUsers();
};

const getUserById = async (id) => {
    return await userRepository.getUserById(id);
};

const createUser = async (data) => {
    return await userRepository.createUser(data);
};

const updateUser = async (id, data) => {
    return await userRepository.updateUser(id, data);
};

const deleteUser = async (id) => {
    return await userRepository.deleteUser(id);
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};

