const express = require('express');
const userController = require('../controllers/userController');
const validateUser = require('../middlewares/validateUser');

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/',validateUser, userController.createUser);
router.put('/:id',validateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
