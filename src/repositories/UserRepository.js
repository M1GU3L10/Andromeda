// src/repositories/UserRepository.js
const User = require('../models/UserModel');

class UserRepository {
    async getUserByUsername(username) {
        return await User.findOne({ where: { username } });
    }

    async createUser(username, password) {
        return await User.create({ username, password });
    }
}

module.exports = UserRepository;
