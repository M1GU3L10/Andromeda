const { models } = require('../models');

const getAllUsers = async () => {
    return await models.User.findAll();
};

const getUserById = async (id) => {
    return await models.User.findByPk(id);
};

const createUser = async (data) => {
    return await models.User.create(data);
};

const updateUser = async (id, data) => {
    return await models.User.update(data, {
        where: { id }
    });
};

const deleteUser = async (id) => {
    return await models.User.destroy({
        where: { id }
    });
};




const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};



module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    createUser,
    findUserByEmail
};

