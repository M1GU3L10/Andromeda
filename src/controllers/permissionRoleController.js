const categoryService = require('../services/permissionRoleService');
const { sendResponse, sendError } = require('../utils/response');

const getAllPermissionsRoles = async (req, res) => {
    try {
        const permissionsRoles = await permissionRoleService.getAllPermissions();
        sendResponse(res, permissionsRoles);
    } catch (error) {
        sendError(res, error);
    }
};

const getPermissionRoleById = async (req, res) => {
    try {
        const permissionRole = await permissionRoleService.getPermissionRoleById(req.params.id);
        if (!category) {
            return sendError(res, 'Permiso rol no encontrado', 404);
        }
        sendResponse(res, permissionRole);
    } catch (error) {
        sendError(res, error);
    }
};

const createPermissionRole = async (req, res) => {
    try {
        const permissionRole = await permissionRoleService.createPermissionRole(req.body);
        sendResponse(res, permissionRole, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updatePermissionRole = async (req, res) => {
    try {
        const updated = await permissionRoleService.updatePermissionRole(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'Permiso rol no encontrado', 404);
        }
        sendResponse(res, 'Permiso rol actualizado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

const deletePermissionRole = async (req, res) => {
    try {
        const deleted = await permissionRoleService.deletePermissionRole(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Permiso rol no funciona', 404);
        }
        sendResponse(res, 'Permiso rol eliminado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllPermissionsRoles,
    getPermissionRoleById,
    createPermissionRole,
    updatePermissionRole,
    deletePermissionRole
};
