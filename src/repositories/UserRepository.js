const { Op } = require('sequelize'); 
const { models } = require('../models');

const findUserByEmail = async (email) => {
    return await models.User.findOne({ where: { email } });
};

const findUserByPhone = async (phone) => {
    return await models.User.findOne({ where: { phone } });
};

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
    try {
        const [updatedRowsCount, updatedUsers] = await models.User.update(data, {
            where: { id },
            returning: true,
        });

        if (updatedRowsCount === 0) {
            throw new Error('No se encontró un usuario con el id proporcionado');
        }

        // Fetch the updated user to ensure we have the complete object
        const updatedUser = await models.User.findByPk(id);
        if (!updatedUser) {
            throw new Error('Error al recuperar el usuario actualizado');
        }

        return updatedUser;
    } catch (error) {
        console.error('Error en updateUser repository:', error);
        throw error;
    }
};


const deleteUser = async (id) => {
    return await models.User.destroy({
        where: { id }
    });
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
    findUserByResetToken,
    updateResetPasswordToken,
    updatePassword,
    findUserByEmail,
    findUserByPhone
};