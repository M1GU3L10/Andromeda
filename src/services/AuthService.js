const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../repositories/UserRepository');
const { JWT_SECRET } = process.env;

const register = async (name, email, password, phone, roleId) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    phone,
    roleId
  });
  return user;
};

const login = async (email, password) => {
  console.log('Iniciando sesión para el email:', email); // Añadir log
  const user = await findUserByEmail(email);
  if (!user) {
    console.log('Usuario no encontrado'); // Añadir log
    throw new Error('Usuario no encontrado');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log('Contraseña inválida'); // Añadir log
    throw new Error('Contraseña inválida');
  }
  const token = jwt.sign({ id: user.id, email: user.email, roleId: user.roleId }, JWT_SECRET, { expiresIn: '1h' });
  console.log('Usuario autenticado:', user); // Añadir log
  return { user, token };
};

module.exports = {
  register,
  login
};
