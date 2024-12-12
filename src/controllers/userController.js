const userService = require('../services/userService');
const authService = require('../services/AuthService');

const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { sendResponse, sendError } = require('../utils/response');

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const getProfile = async (req, res) => {
    try {
        const profile = await userService.getUserProfile(req.user.id);
        res.json(profile);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phone, password } = req.body;
        
        const updatedProfile = await userService.updateProfile(userId, {
            name,
            email,
            phone,
            ...(password && { password })
        });

        const token = jwt.sign(
            { id: userId, ...updatedProfile },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.json({
            user: updatedProfile,
            token
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(400).json({ message: error.message });
    }
};


const checkEmailExists = async (req, res) => {
    try {
        const { email } = req.params;
        const exists = await userService.checkEmailExists(email);
        res.json({ exists });
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

const checkPhoneExists = async (req, res) => {
    try {
        const { phone } = req.params;
        const exists = await userService.checkPhoneExists(phone);
        res.json({ exists });
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        sendResponse(res, users);
    } catch (error) {
        sendError(res, error);
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return sendError(res, 'Usuario no encontrado', 404);
        }
        sendResponse(res, user);
    } catch (error) {
        sendError(res, error);
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, roleId } = req.body;
        const user = await authService.register(name, email, password, phone, roleId);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, phone, roleId, status } = req.body;
        
        let updateData = { name, email, phone, roleId, status };
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }
        
        const updatedUser = await authService.updateUser(id, updateData);
        sendResponse(res, updatedUser, 200, 'Usuario actualizado correctamente');
    } catch (error) {
        console.error('Error updating user:', error);
        sendError(res, error.message, 400);
    }
};


const deleteUser = async (req, res) => {
    try {
        const deleted = await userService.deleteUser(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Usuario no encontrado', 404);
        }
        sendResponse(res, 'Usuario eliminado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password, phone, roleId } = req.body;
        const user = await authService.register(name, email, password, phone, roleId);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Restablecer contraseña

// Solicitar el restablecimiento de la contraseña
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await userService.requestPasswordReset(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Restablecer la contraseña con el token
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const result = await userService.resetPassword(token, newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Registrar con google
// Código existente...
const loginWithGoogle = async (req, res) => {
    const { tokenId } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        let user = await userService.findUserByEmail(payload.email);

        if (!user) {
            const password = await bcrypt.hash('googleAuth' + payload.email, 10);
            user = await userService.createUser({
                name: payload.name,
                email: payload.email,
                password: password,
                phone: payload.phone_number || null,
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ user, token });
    } catch (error) {
        console.error('Error verificando token de Google:', error);
        res.status(400).json({ message: 'Error con la autenticación de Google' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    editUser,
    deleteUser,
    register,
    login,
    requestPasswordReset,
    resetPassword,
    loginWithGoogle,
    checkEmailExists,
    checkPhoneExists,
    getProfile,
    updateProfile
};