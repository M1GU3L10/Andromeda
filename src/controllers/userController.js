const userService = require('../services/userService');
const authService = require('../services/authService');
const { sendResponse, sendError } = require('../utils/response');

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
        const user = await userService.createUser(req.body);
        sendResponse(res, user, 201);
    } catch (error) {
        sendError(res, error);
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


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    register,
    login
};
