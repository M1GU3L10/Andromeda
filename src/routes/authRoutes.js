// src/routes/authRoutes.js
const express = require('express');
const { register, login, protectedRoute } = require('../controllers/AuthController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', protectedRoute);

module.exports = router;
