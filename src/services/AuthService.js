// src/services/AuthService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async registerUser(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.userRepository.createUser(username, hashedPassword);
    }

    async authenticateUser(username, password) {
        const user = await this.userRepository.getUserByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id }, 'your_jwt_secret_key');
            return token;
        }
        return null;
    }
}

module.exports = AuthService;
