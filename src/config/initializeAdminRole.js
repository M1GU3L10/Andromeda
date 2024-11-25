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

        console.log('Iniciando la asignación de permisos para roles Empleado y Cliente...');

        // Crear o encontrar el rol Empleado
        const [employeeRole] = await Role.findOrCreate({
            where: { name: 'Empleado' },
            defaults: {
                name: 'Empleado',
                description: 'Rol con permisos limitados en el sistema'
            }
        });

        // Crear o encontrar el rol Cliente
        const [clientRole] = await Role.findOrCreate({
            where: { name: 'Cliente' },
            defaults: {
                name: 'Cliente',
                description: 'Rol con acceso limitado a funcionalidades de cliente'
            }
        });

        // 2. Obtener todos los permisos
        const allPermissions = await Permission.findAll();

        ///
        const allPermissionsDos = await Permission.findAll();
        const permissionsMap = allPermissionsDos.reduce((map, permission) => {
            map[permission.name] = permission.id;
            return map;
        }, {});

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

         // Permisos para el rol Empleado (todos menos Usuarios, Roles, Dashboard)
         const excludedPermissions = ['Usuarios', 'Roles', 'Dashboard'];
         const employeePermissions = allPermissions.filter(
             permission => !excludedPermissions.includes(permission.name)
         );
 
         const employeePermissionRoles = employeePermissions.map(permission => ({
             roleId: employeeRole.id,
             permissionId: permission.id
         }));
 
         // Permiso para el rol Cliente (solo Vista Cliente)
         const clientPermission = allPermissions.find(permission => permission.name === 'Vista Cliente');
 
         const clientPermissionRoles = clientPermission
             ? [{ roleId: clientRole.id, permissionId: clientPermission.id }]
             : [];
 
         // Asignar permisos
         await PermissionRole.bulkCreate([...employeePermissionRoles, ...clientPermissionRoles], {
             ignoreDuplicates: true
         });

        console.log('Rol administrador creado y permisos asignados exitosamente');
        
        return adminRole;
    } catch (error) {
        console.error('Error al crear el rol administrador:', error);
        throw error;
    }
};

module.exports = initializeAdminRole;