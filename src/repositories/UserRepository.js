const { Op } = require('sequelize'); 
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
    const [updatedRowsCount, [updatedUser]] = await models.User.update(data, {
        where: { id },
        returning: true,
    });
    return updatedUser;
};

const deleteUser = async (id) => {
    return await models.User.destroy({
        where: { id }
    });
};

const findUserByEmail = async (email) => {
    return await models.User.findOne({ where: { email } });
};

//Restablecer contraseña 
const findUserByResetToken = async (token) => {
    return await models.User.findOne({ where: { resetPasswordToken: token, resetPasswordExpires: { [Op.gt]: Date.now() } } });
};

const updateResetPasswordToken = async (id, token, expires) => {
    return await models.User.update({ resetPasswordToken: token, resetPasswordExpires: expires }, { where: { id } });
};

const updatePassword = async (id, newPassword) => {
    return await models.User.update({ password: newPassword, resetPasswordToken: null, resetPasswordExpires: null }, { where: { id } });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    findUserByEmail,
    findUserByResetToken,
    updateResetPasswordToken,
    updatePassword
};
