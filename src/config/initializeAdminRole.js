const Role = require('../models/role');
const Permission = require('../models/permission');
const PermissionRole = require('../models/permissionRole');

const initializeAdminRole = async () => {
    try {
        console.log('Iniciando la creación del rol administrador...');

        // 1. Crear o encontrar el rol administrador
        const [adminRole] = await Role.findOrCreate({
            where: { name: 'Administrador' },
            defaults: {
                name: 'Administrador',
                description: 'Rol con acceso completo al sistema'
            }
        });

        // 2. Obtener todos los permisos
        const allPermissions = await Permission.findAll();

        // 3. Preparar los datos para la asignación de permisos
        const permissionRoles = allPermissions.map(permission => ({
            roleId: adminRole.id,
            permissionId: permission.id
        }));

        // 4. Crear las asignaciones de permisos
        await PermissionRole.bulkCreate(permissionRoles, {
            ignoreDuplicates: true,
            updateOnDuplicate: ['roleId', 'permissionId']
        });

        console.log('Rol administrador creado y permisos asignados exitosamente');
        
        return adminRole;
    } catch (error) {
        console.error('Error al crear el rol administrador:', error);
        throw error;
    }
};

module.exports = initializeAdminRole;