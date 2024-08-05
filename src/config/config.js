require('dotenv').config();

module.exports = {
  port: process.env.PORT || 1056,
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key'
};
