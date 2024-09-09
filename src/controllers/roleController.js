// controllers/roleController.js
const roleService = require('../services/roleService');
const permissionService = require('../services/permissionService');
const { sendResponse, sendError } = require('../utils/response');


// Controlador para crear o actualizar un rol


// Obtener todos los roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await roleService.getAllRoles();
        sendResponse(res, roles);
    } catch (error) {
        sendError(res, error);
    }
};


// Obtener un rol por ID
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

// controllers/roleController.js
const createRole = async (req, res) => {
    try {
        const { name, status, permissions } = req.body;
        const newRole = await roleService.createRole({ name, status }, permissions);
        sendResponse(res, { message: 'Rol creado exitosamente', role: newRole }, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updateRole = async (req, res) => {
    try {
        const { name, status, permissions } = req.body;
        const { id } = req.params;
        const role = await roleService.updateRole(id, { name, status }, permissions);
        sendResponse(res, 'Rol actualizado exitosamente');
    } catch (error) {
        sendError(res, error);
    }
};

// Eliminar un rol
const deleteRole = async (req, res) => {
    try {
        const deleted = await roleService.deleteRole(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Rol no encontrado', 404);
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
