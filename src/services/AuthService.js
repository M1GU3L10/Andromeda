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

const updateUser = async (id, userData) => {
    try {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        
        const updatedUser = await userRepository.updateUser(id, userData);
        
        if (!updatedUser) {
            throw new Error('Usuario no encontrado');
        }

        const userObj = updatedUser.toJSON();
        const { password: _, ...userWithoutPassword } = userObj;
        const token = jwtUtils.generateToken(userWithoutPassword);
        
        return { user: userWithoutPassword, token };
    } catch (error) {
        console.error('Error en AuthService updateUser:', error);
        throw error;
    }
};

const login = async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Credenciales inválidas');
    }

    const userObj = user.toJSON();
    const { password: _, ...userWithoutPassword } = userObj;
    const token = jwtUtils.generateToken(userWithoutPassword);
    
    return { user: userWithoutPassword, token };
};


module.exports = {
    register,
    login,
    updateUser 
};