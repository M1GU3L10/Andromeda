const privilegePermissionRoleService = require('../services/privilegePermissionRoleService');
const { sendResponse, sendError } = require('../utils/response');

const getAllPrivilegePermissionRoles = async (req, res) => {
    try {
        const privilegePermissionRoles = await privilegePermissionRoleService.getAllPrivilegePermissionRoles();
        sendResponse(res, privilegePermissionRoles);
    } catch (error) {
        sendError(res, error);
    }
};

const getPrivilegePermissionRoleById = async (req, res) => {
    try {
        const privilegePermissionRole = await privilegePermissionRoleService.getPrivilegePermissionRoleById(req.params.id);
        if (!privilegePermissionRole) {
            return sendError(res, 'PrivilegePermissionRole not found', 404);
        }
        sendResponse(res, privilegePermissionRole);
    } catch (error) {
        sendError(res, error);
    }
};

const createPrivilegePermissionRole = async (req, res) => {
    try {
        const privilegePermissionRole = await privilegePermissionRoleService.createPrivilegePermissionRole(req.body);
        sendResponse(res, privilegePermissionRole, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updatePrivilegePermissionRole = async (req, res) => {
    try {
        const updated = await privilegePermissionRoleService.updatePrivilegePermissionRole(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'PrivilegePermissionRole not found', 404);
        }
        sendResponse(res, 'PrivilegePermissionRole updated successfully');
    } catch (error) {
        sendError(res, error);
    }
};

const deletePrivilegePermissionRole = async (req, res) => {
    try {
        const deleted = await privilegePermissionRoleService.deletePrivilegePermissionRole(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'PrivilegePermissionRole not found', 404);
        }
        sendResponse(res, 'PrivilegePermissionRole deleted successfully');
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllPrivilegePermissionRoles,
    getPrivilegePermissionRoleById,
    createPrivilegePermissionRole,
    updatePrivilegePermissionRole,
    deletePrivilegePermissionRole
};