const express = require('express');
const userController = require('../controllers/userController');
// const validateCategory = require('../middlewares/validateCategory');

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
