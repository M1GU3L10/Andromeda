'use strict';

const sequelize = require('./database');
const { QueryTypes } = require('sequelize');
const Privilege = require('../models/privilegios'); // Adjust the path as needed

async function seedPrivileges() {
    try {
        // Verificar si ya existen privilegios
        const [result] = await sequelize.query(
            'SELECT COUNT(*) as count FROM privileges',
            { type: QueryTypes.SELECT }
        );

        // Si ya existen privilegios, no hacer nada
        if (parseInt(result.count) > 0) {
            console.log('Los privilegios ya están registrados. Omitiendo seeder.');
            return;
        }

        // Crear privilegios
        const privilegesToSeed = [
            //ROLES PRIVILEGES
            { name: 'Registrar', permissionId: 1 },
            { name: 'Editar', permissionId: 1 },
            { name: 'Buscar', permissionId: 1 },
            { name: 'Cambiar_estado', permissionId: 1 },
            { name: 'Ver', permissionId: 1 },
            { name: 'Eliminar', permissionId: 1 },

            //USERS PRIVILEGES
            { name: 'Registrar', permissionId: 2 },
            { name: 'Editar', permissionId: 2 },
            { name: 'Buscar', permissionId: 2 },
            { name: 'Cambiar_estado', permissionId: 2 },
            { name: 'Ver', permissionId: 2 },
            { name: 'Eliminar', permissionId: 2 },

            //CATEGORIES PRIVILEGES
            { name: 'Registrar', permissionId: 3 },
            { name: 'Editar', permissionId: 3 },
            { name: 'Buscar', permissionId: 3 },
            { name: 'Cambiar_estado', permissionId: 3 },
            { name: 'Eliminar', permissionId: 3 },

            //PRODUCTS PRIVILEGES
            { name: 'Registrar', permissionId: 4 },
            { name: 'Editar', permissionId: 4 },
            { name: 'Buscar', permissionId: 4 },
            { name: 'Cambiar_estado', permissionId: 4 },
            { name: 'Ver', permissionId: 4 },
            { name: 'Eliminar', permissionId: 4 },

            //SUPLIERS PRIVILEGES
            { name: 'Registrar', permissionId: 5 },
            { name: 'Editar', permissionId: 5 },
            { name: 'Buscar', permissionId: 5 },
            { name: 'Cambiar_estado', permissionId: 5 },
            { name: 'Ver', permissionId: 5 },
            { name: 'Eliminar', permissionId: 5 },

            //SHOPPINGS PRIVILEGES
            { name: 'Registrar', permissionId: 6 },
            { name: 'Buscar', permissionId: 6 },
            { name: 'Cambiar_estado', permissionId: 6 },
            { name: 'Ver', permissionId: 6 },
            { name: 'Informe', permissionId: 6 },

            //SERVICES PRIVILEGES
            { name: 'Registrar', permissionId: 7 },
            { name: 'Editar', permissionId: 7 },
            { name: 'Buscar', permissionId: 7 },
            { name: 'Cambiar_estado', permissionId: 7 },
            { name: 'Ver', permissionId: 7 },
            { name: 'Eliminar', permissionId: 7 },

            //PROGRAMMING PRIVILEGES
            { name: 'Buscar', permissionId: 8 },
            { name: 'Ver', permissionId: 8 },

            //ABSENCES PRIVILEGES
            { name: 'Registrar', permissionId: 9 },
            { name: 'Editar', permissionId: 9 },
            { name: 'Buscar', permissionId: 9 },
            { name: 'Cambiar_estado', permissionId: 9 },
            { name: 'Ver', permissionId: 9 },
            { name: 'Eliminar', permissionId: 9 },

            //APPOINTMENT PRIVILEGES
            { name: 'Registrar', permissionId: 10 },
            { name: 'Buscar', permissionId: 10 },
            { name: 'Cambiar_estado', permissionId: 10 },
            { name: 'Ver', permissionId: 10 },

            //ORDERS PRIVILEGES
            { name: 'Registrar', permissionId: 11 },
            { name: 'Editar', permissionId: 11 },
            { name: 'Buscar', permissionId: 11 },
            { name: 'Cambiar_estado', permissionId: 11 },
            { name: 'Ver', permissionId: 11 },
            { name: 'Eliminar', permissionId: 11 },

            //SALES PRIVILEGES
            { name: 'Registrar', permissionId: 12 },
            { name: 'Buscar', permissionId: 12 },
            { name: 'Cambiar_estado', permissionId: 12 },
            { name: 'Ver', permissionId: 12 },
            { name: 'Informe', permissionId: 12 }
        ];

        // Insertar los privilegios
        await Privilege.bulkCreate(privilegesToSeed);
        console.log('Privilegios sembrados exitosamente.');
    } catch (error) {
        console.error('Error al sembrar privilegios:', error);
    }
}

module.exports = seedPrivileges;