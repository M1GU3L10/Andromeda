const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');
const userRepository = require('../repositories/UserRepository');

const register = async (name, email, password, phone, roleId) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.createUser({
        name,
        email,
        password: hashedPassword,
        phone,
        roleId
    });
    const token = jwtUtils.generateToken(user);
    return { user, token };
};

const login = async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Contraseña incorrecta');
    }
    const token = jwtUtils.generateToken(user);
    return { user, token };
};

module.exports = {
    register,
    login
};
