require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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

//Restablecer contraseña
const requestPasswordReset = async (email) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hora

    await userRepository.updateResetPasswordToken(user.id, resetToken, resetTokenExpires);

    // Configuración del transporte para nodemailer usando variables de entorno
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Usuario (correo) desde las variables de entorno
            pass: process.env.EMAIL_PASS, // Contraseña desde las variables de entorno
        },
    });

    // Enviar el correo electrónico
    await transporter.sendMail({
        to: email,
        from: 'no-reply@yourapp.com',
        subject: 'Restablecer contraseña',
        text: `Has solicitado restablecer tu contraseña. Usa el siguiente token: ${resetToken}`,
    });

    return { message: 'Correo de restablecimiento enviado' };
};

// Restablecer contraseña: confirmar y actualizar contraseña 
const resetPassword = async (token, newPassword) => {
    const user = await userRepository.findUserByResetToken(token);
    if (!user) {
        throw new Error('Token inválido o caducado');
    }

    // Generar hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos
    await userRepository.updatePassword(user.id, hashedPassword);

    return { message: 'Contraseña restablecida con éxito' };
};

//Buscar un usuario por su correo electronico
const findUserByEmail = async (email) => {
    return await userRepository.findUserByEmail(email);
};


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    requestPasswordReset,
    resetPassword,
    findUserByEmail
};

