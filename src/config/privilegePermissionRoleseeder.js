'use strict';

const sequelize = require('./database');
const { QueryTypes } = require('sequelize');
const PrivilegePermissionRole = require('../models/privilegePermissionRole');
const PermissionRole = require('../models/permissionRole');
const Privilege = require('../models/privilegios');

async function seedPrivilegePermissionRoles() {
    try {
        // Verificar si ya existen registros
        const [result] = await sequelize.query(
            'SELECT COUNT(*) as count FROM privilegesPermissionRole',
            { type: QueryTypes.SELECT }
        );

        // Si ya existen registros, no hacer nada
        if (parseInt(result.count) > 0) {
            console.log('Los PrivilegePermissionRoles ya están registrados. Omitiendo seeder.');
            return;
        }

        // Definir los privilegios para cada permissionRole
        const privilegesByPermissionRole = {
            1: [1, 2, 3, 4, 5, 6], // Roles
            2: [7, 8, 9, 10, 11, 12], // Users
            3: [13, 14, 15, 16, 17], // Categories
            4: [18, 19, 20, 21, 22, 23], // Products
            5: [24, 25, 26, 27, 28, 29], // Suppliers
            6: [30, 31, 32, 33, 34], // Shoppings
            7: [35, 36, 37, 38, 39, 40], // Services
            8: [41, 42], // Programming
            9: [43, 44, 45, 46, 47, 48], // Absences
            10: [49, 50, 51, 52], // Appointment
            11: [53, 54, 55, 56, 57, 58], // Orders
            12: [59, 60, 61, 62, 63] // Sales
        };

        // Crear array para almacenar todos los PrivilegePermissionRoles
        const privilegePermissionRolesToSeed = [];

        // Para cada PermissionRole, asignar los privilegios correspondientes
        for (const [permissionRoleId, privilegeIds] of Object.entries(privilegesByPermissionRole)) {
            for (const privilegeId of privilegeIds) {
                privilegePermissionRolesToSeed.push({
                    permissionRoleId: parseInt(permissionRoleId),
                    privilegeId: privilegeId
                });
            }
        }

        // Insertar los PrivilegePermissionRoles
        await PrivilegePermissionRole.bulkCreate(privilegePermissionRolesToSeed);
        console.log('PrivilegePermissionRoles sembrados exitosamente.');

        // Verificar que se hayan creado los registros correctamente
        const createdCount = await PrivilegePermissionRole.count();
        console.log(`Se han creado ${createdCount} PrivilegePermissionRoles.`);

    } catch (error) {
        console.error('Error al sembrar PrivilegePermissionRoles:', error);
    }
}

module.exports = seedPrivilegePermissionRoles;