require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userRepository = require('../repositories/UserRepository');

const getUserProfile = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    const userObj = user.toJSON();
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
};

const updateProfile = async (userId, userData) => {
    const existingUser = await userRepository.getUserById(userId);
    if (!existingUser) {
        throw new Error('Usuario no encontrado');
    }

    if (userData.email) {
        const emailUser = await userRepository.findUserByEmail(userData.email);
        if (emailUser && emailUser.id !== userId) {
            throw new Error('El correo electrónico ya está en uso');
        }
    }

    if (userData.phone) {
        const phoneUser = await userRepository.findUserByPhone(userData.phone);
        if (phoneUser && phoneUser.id !== userId) {
            throw new Error('El número de teléfono ya está en uso');
        }
    }

    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }

    const updatedUser = await userRepository.updateUser(userId, userData);
    if (!updatedUser) {
        throw new Error('Error al actualizar el usuario');
    }

    const userObj = updatedUser.toJSON();
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
};

const checkEmailExists = async (email) => {
    const user = await userRepository.findUserByEmail(email);
    return !!user;
};

const checkPhoneExists = async (phone) => {
    const user = await userRepository.findUserByPhone(phone);
    return !!user;
};

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
    try {
        return await userRepository.updateUser(id, data);
    } catch (error) {
        console.error('Error en updateUser service:', error);
        throw error;
    }
};

const deleteUser = async (id) => {
    return await userRepository.deleteUser(id);
};

const requestPasswordReset = async (email) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hora

    await userRepository.updateResetPasswordToken(user.id, resetToken, resetTokenExpires);

    // Configuración del transporte para nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // HTML template para el correo con estilos en línea y logo hosteado
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecer Contraseña</title>
    </head>
    <body style="font-family: 'Helvetica', Arial, sans-serif; background-color: #1E1E1E; color: #FFFFFF; padding: 20px; line-height: 1.6; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #2A2A2A, #1A1A1A); padding: 30px; border-radius: 15px; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
           <div style="text-align: center; margin-bottom: 30px;">
    <img src="https://tu-dominio.com/ruta/a/tu/logo-light.png" 
         alt="Logo" 
         style="max-width: 180px; height: auto;"
         width="180"
         height="auto">
</div>
            <h1 style="color: #FFFFFF; text-align: center; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 25px; border-bottom: 2px solid #003366; padding-bottom: 10px;">
                Restablecer Contraseña
            </h1>
            <p style="color: #FFFFFF; font-size: 14px; margin: 15px 0;">
                Estimado usuario,
            </p>
            <p style="color: #FFFFFF; font-size: 14px; margin: 15px 0;">
                Has solicitado restablecer tu contraseña. Utiliza el siguiente código de verificación:
            </p>
            <div style="font-size: 20px; font-weight: bold; text-align: center; margin: 30px 0; padding: 18px; background: linear-gradient(145deg, #2A2A2A, #222222); border-radius: 10px; color: #FFFFFF; letter-spacing: 5px; border: 1px solid #003366; box-shadow: 0 5px 15px rgba(255, 215, 0, 0.1);">
                ${resetToken}
            </div>
            <p style="color: #FFFFFF; font-size: 14px; margin: 15px 0;">
                Este código es válido por los próximos 60 minutos. Si no has solicitado restablecer tu contraseña, por favor ignora este mensaje.
            </p>
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #003366;">
                <p style="color: #888888; font-size: 10px; margin-top: 15px; text-align: center;">
                    Este es un correo automático, por favor no responda.<br>
                    &copy; 2024 Brberia orion . Todos los derechos reservados.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Enviar el correo electrónico
    await transporter.sendMail({
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Restablecer contraseña',
        html: htmlContent
    });

    return { message: 'Correo de restablecimiento enviado' };
};

const resetPassword = async (token, newPassword) => {
    const user = await userRepository.findUserByResetToken(token);
    if (!user) {
        throw new Error('Token inválido o caducado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(user.id, hashedPassword);

    return { message: 'Contraseña restablecida con éxito' };
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    requestPasswordReset,
    resetPassword,
    checkEmailExists,
    checkPhoneExists,
    getUserProfile,
    updateProfile
};