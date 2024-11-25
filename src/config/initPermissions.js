const Permission = require('../models/permission');

const defaultPermissions = [
    'Roles',
    'Usuarios',
    'Categorias',
    'Productos',
    'Proveedores',
    'Compras',
    'Servicios',
    'Programacion de empleado',
    'Ausencias',
    'Citas',
    'Pedidos',
    'Ventas',
    'Perfil',
    'Dashboard',
    'Vista Cliente'
];

const initializePermissions = async () => {
    try {
        console.log('Iniciando la sincronización de permisos...');
        
        // Crear los permisos si no existen
        const permissionsToCreate = defaultPermissions.map(name => ({
            name: name
        }));

        await Permission.bulkCreate(permissionsToCreate, {
            ignoreDuplicates: true,
            updateOnDuplicate: ['name']
        });

        console.log('Permisos sincronizados exitosamente');
    } catch (error) {
        console.error('Error al sincronizar permisos:', error);
    }
};

module.exports = initializePermissions;