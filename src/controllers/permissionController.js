const permissionService = require('../services/permissionService');
const { sendResponse, sendError } = require('../utils/response');

const createMultiplePermissions = async (req, res) => {
    try {
        const permissionNames = req.body.permissions || [
            'Horizonte', 'Melodía', 'Destello', 'Serenidad', 'Recuerdo',
            'Espejo', 'Amanecer', 'Silencio', 'Ternura', 'Fantasía',
            'Fragancia', 'Brisa', 'Murmullo', 'Éxtasis', 'Infinito',
            'Destino', 'Sombras', 'Susurro', 'Aurora', 'Vértigo'
        ];

        const permissions = await permissionService.createMultiplePermissions(permissionNames);
        sendResponse(res, permissions, 201); // Respuesta con todos los permisos creados
    } catch (error) {
        sendError(res, error);
    }
};
//registrar pemisos desde la api

//
const getAllPermissions = async (req, res) => {
    try {
        const permissions = await permissionService.getAllPermissions();
        sendResponse(res, permissions);
    } catch (error) {
        sendError(res, error);
    }
};
const getPermissionById = async (req, res) => {
    try {
        const permission = await permissionService.getPermissionById(req.params.id);
        if (!permission) {  // Cambié "category" por "permission"
            return sendError(res, 'Permiso no encontrado', 404);
        }
        sendResponse(res, permission);
    } catch (error) {
        sendError(res, error);
    }
};

const createPermission = async (req, res) => {
    try {
        const permission = await permissionService.createPermission(req.body);
        sendResponse(res, permission, 201);
    } catch (error) {
        sendError(res, error);
    }
};
const updatePermission = async (req, res) => {
    try {
        const updated = await permissionService.updatePermission(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'Permiso no encontrado', 404);
        }
        sendResponse(res, 'Permiso actualizado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};
const deletePermission = async (req, res) => {
    try {
        const deleted = await permissionService.deletePermission(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Permission no funciona', 404);
        }
        sendResponse(res, 'Permiso eliminado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};
module.exports = {
    getAllPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    createMultiplePermissions
};