const express = require('express');
const userController = require('../controllers/userController');
const validateUser = require('../middlewares/validateUser');
const authMiddleware = require('../middlewares/authMiddleware');
const { models } = require('../models');

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', validateUser, userController.createUser);
router.put('/:id', validateUser, userController.editUser);
router.delete('/:id', userController.deleteUser);

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/forgot-password', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);

router.post('/login/google', userController.loginWithGoogle);

router.get('/check-email/:email', userController.checkEmailExists);
router.get('/check-phone/:phone', userController.checkPhoneExists);

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile/:id', authMiddleware, userController.updateProfile);

module.exports = router;