// src/routes/authRoutes.js
const express = require('express');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', protectedRoute);

module.exports = router;
