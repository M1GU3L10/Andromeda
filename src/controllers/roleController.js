const roleService = require('../services/roleService');
const { sendResponse, sendError } = require('../utils/response');

const getAllRoles = async (req, res) => {
    try {
        const roles = await roleService.getAllRoles();
        sendResponse(res, roles);
    } catch (error) {
        sendError(res, error);
    }
};

const getRoleById = async (req, res) => {
    try {
        const role = await roleService.getRoleById(req.params.id);
        if (!role) {
            return sendError(res, 'Rol no encontrado', 404);
        }
        sendResponse(res, role);
    } catch (error) {
        sendError(res, error);
    }
};

const createRole = async (req, res) => {
    try {
        const roles = await roleService.createRole(req.body);
        sendResponse(res, role, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updateRole = async (req, res) => {
    try {
        const updated = await roleService.updateRole(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'Rol no encontrado', 404);
        }
        sendResponse(res, 'Rol actualizado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

const deleteRole = async (req, res) => {
    try {
        const deleted = await roleService.deleteRole(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Rol no funciona', 404);
        }
        sendResponse(res, 'Rol eliminado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};
