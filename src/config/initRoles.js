const Permission = require('../models/role');

const defaultRoles = [
    'Administrador',
    'Empleado',
    'Cliente'
];

const initializeRoles = async () => {
    try {
        console.log('Iniciando la sincronización de roles...');
        
        
        const rolesToCreate = defaultRoles.map(name => ({
            name: name
        }));

        await Permission.bulkCreate(rolesToCreate, {
            ignoreDuplicates: true,
            updateOnDuplicate: ['name']
        });

        console.log('Roles sincronizados exitosamente');
    } catch (error) {
        console.error('Error al sincronizar roles:', error);
    }
};

module.exports = initializeRoles;