const Permission = require('../models/permission');

const defaultPermissions = [
    'Roles',
    'Roles registrar',
    'Roles editar',
    'Roles eliminar',
    'Roles cambiar estado',
    'Roles ver',
    'Usuarios',
    'Usuarios registrar',
    'Usuarios editar',
    'Usuarios eliminar',
    'Usuarios cambiar estado',
    'Usuarios ver',
    'Categorias',
    'Categorias registrar',
    'Categorias editar',
    'Categorias eliminar',
    'Categorias cambiar estado',
    'Productos',
    'Productos registrar',
    'Productos editar',
    'Productos eliminar',
    'Productos cambiar estado',
    'Productos ver',
    'Proveedores',
    'Proveedores registrar',
    'Proveedores editar',
    'Proveedores eliminar',
    'Proveedores cambiar estado',
    'Proveedores ver',
    'Compras',
    'Compras registrar',
    'Compras cambiar estado',
    'Compras imprimir',
    'Compras ver',
    'Servicios',
    'Servicios registrar',
    'Servicios editar',
    'Servicios eliminar',
    'Servicios cambiar estado',
    'Servicios ver',
    'Programacion de empleado',
    'Programacion ver',
    'Ausencias',
    'Ausencias registrar',
    'Ausencias editar',
    'Ausencias eliminar',
    'Ausencias ver',
    'Citas',
    'Citas registrar',
    'Citas cambiar estado',
    'Citas ver',
    'Pedidos',
    'Pedidos registrar',
    'Pedidos editar',
    'Pedidos eliminar',
    'Pedidos ver',
    'Ventas',
    'Ventas registrar',
    'Ventas cambiar estado',
    'Ventas imprimir',
    'Ventas ver',
    'Perfil',
    'Dashboard'
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