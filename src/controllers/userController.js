const userService = require('../services/userService');
const authService = require('../services/authService');

const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { sendResponse, sendError } = require('../utils/response');

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

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

const updateUser = async (req, res) => {
    try {
        const updated = await userService.updateUser(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'Usuario no encontrado', 404);
        }
        sendResponse(res, 'Usuario actualizado correctamente');
    } catch (error) {
        sendError(res, error);
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
    updateUser,
    deleteUser,
    register,
    login,
    requestPasswordReset,
    resetPassword,
    loginWithGoogle
};
