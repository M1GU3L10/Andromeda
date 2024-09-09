const permissionRoleService = require('../services/permissionRoleService'); // Cambia el nombre de 'categoryService'
const { sendResponse, sendError } = require('../utils/response');

const getAllPermissionsRoles = async (req, res) => {
    try {
        const permissionsRoles = await permissionRoleService.getAllPermissionsRoles(); // Aquí debe ser getAllPermissionsRoles
        sendResponse(res, permissionsRoles);
    } catch (error) {
        sendError(res, error);
    }
};

const getPermissionRoleById = async (req, res) => {
    try {
        const permissionRole = await permissionRoleService.getPermissionRoleById(req.params.id); // Utiliza 'permissionRoleService'
        if (!permissionRole) {
            return sendError(res, 'Permiso rol no encontrado', 404);
        }
        sendResponse(res, permissionRole);
    } catch (error) {
        sendError(res, error);
    }
};

const createPermissionRole = async (req, res) => {
    try {
        const permissionRole = await permissionRoleService.createPermissionRole(req.body); // Utiliza 'permissionRoleService'
        sendResponse(res, permissionRole, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updatePermissionRole = async (req, res) => {
    try {
        const updated = await permissionRoleService.updatePermissionRole(req.params.id, req.body); // Utiliza 'permissionRoleService'
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
        const deleted = await permissionRoleService.deletePermissionRole(req.params.id); // Utiliza 'permissionRoleService'
        if (deleted === 0) {
            return sendError(res, 'Permiso rol no encontrado', 404);
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
