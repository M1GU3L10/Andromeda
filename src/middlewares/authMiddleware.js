require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getUserById } = require('../services/userService');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
        }

        const decoded = jwt.verify(token,'your_secret_key');
        const user = await getUserById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error en authMiddleware:', error);
        res.status(401).json({ message: 'Token no válido o expirado' });
    }
};

module.exports = authMiddleware;
