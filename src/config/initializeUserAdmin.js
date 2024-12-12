const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/role');

const initializeUserAdmin = async () => {
    try {
        console.log('Iniciando la creación del usuario administrador...');

        // 1. Buscar el rol de administrador
        const adminRole = await Role.findOne({ where: { name: 'Administrador' } });
        if (!adminRole) {
            throw new Error('Rol Administrador no encontrado. Asegúrate de inicializar los roles primero.');
        }

        // 2. Verificar si ya existe un usuario administrador
        const existingAdmin = await User.findOne({ where: { email: 'barberiaorion2@gmail.com' } });
        if (existingAdmin) {
            console.log('El usuario administrador ya existe.');
            return existingAdmin;
        }

        // 3. Crear la contraseña encriptada
        const hashedPassword = await bcrypt.hash('orion12345', 10); // Cambia 'admin123' por una contraseña más segura

        // 4. Crear el usuario administrador
        const adminUser = await User.create({
            name: 'Orion',
            email: 'barberiaorion2@gmail.com',
            password: hashedPassword,
            phone: '1234567890',
            roleId: adminRole.id
        });

        console.log('Usuario administrador creado exitosamente.');

        // 5. Generar un token JWT  
        const token = jwt.sign(
            {
                id: adminUser.id,
                email: adminUser.email,
                roleId: adminRole.id
            },
            process.env.JWT_SECRET || 'mysecretkey', // Cambia 'mysecretkey' por una clave secreta más segura
            { expiresIn: '1h' }
        );

        console.log('Token JWT generado:', token);

        return { adminUser, token };
    } catch (error) {
        console.error('Error al crear el usuario administrador:', error);
        throw error;
    }
};

module.exports = initializeUserAdmin;
