const Permission = require('../models/role');

const defaultRoles = ['Administrador', 'Empleado', 'Cliente'];

const initializeRoles = async () => {
    try {
        console.log('Iniciando la sincronización de roles...');

        for (const roleName of defaultRoles) {
            // Buscar si el rol ya existe
            const [role, created] = await Permission.findOrCreate({
                where: { name: roleName },
                defaults: { name: roleName },
            });
 
            if (created) {
                console.log(`Rol creado: ${roleName}`);
            } else {
                console.log(`Rol ya existente: ${roleName}`);
            }
        }   

        console.log('Roles sincronizados exitosamente.');
    } catch (error) {
        console.error('Error al sincronizar roles:', error);
    }
};
 
module.exports = initializeRoles;
