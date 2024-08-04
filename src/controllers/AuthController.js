// src/controllers/AuthController.js
const AuthService = require('../services/AuthService');
const jwt = require('jsonwebtoken');
const { sendResponse, sendError } = require('../utils/response');

const authService = new AuthService();

const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await authService.registerUser(username, password);
        res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'User registration failed' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const token = await authService.authenticateUser(username, password);
    if (token) {
        res.status(200).json({ token });
        
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

const protectedRoute = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        res.status(200).json({ message: `Hello user ${decoded.id}` });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { register, login, protectedRoute };
