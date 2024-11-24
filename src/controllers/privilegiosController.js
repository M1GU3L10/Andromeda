const privilegeService = require('../services/privilegiosService');
const { sendResponse, sendError } = require('../utils/response');

const getAllPrivileges = async (req, res) => {
    try {
        const privileges = await privilegeService.getAllPrivileges();
        sendResponse(res, privileges);
    } catch (error) {
        sendError(res, error);
    }
};

const getPrivilegeById = async (req, res) => {
    try {
        const privilege = await privilegeService.getPrivilegeById(req.params.id);
        if (!privilege) {
            return sendError(res, 'Privilegio no encontrado', 404);
        }
        sendResponse(res, privilege);
    } catch (error) {
        sendError(res, error);
    }
};

const createPrivilege = async (req, res) => {
    try {
        const privilege = await privilegeService.createPrivilege(req.body);
        sendResponse(res, privilege, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updatePrivilege = async (req, res) => {
    try {
        const updated = await privilegeService.updatePrivilege(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'Privilegio no encontrado', 404);
        }
        sendResponse(res, 'Privilegio actualizado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

const createMultiplePrivileges = async (req, res) => {
    try {
        const privileges = await privilegeService.createMultiplePrivileges(req.body);
        sendResponse(res, { message: 'Privileges created successfully', privileges }, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const deletePrivilege = async (req, res) => {
    try {
        const deleted = await privilegeService.deletePrivilege(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Privilegio no encontrado', 404);
        }
        sendResponse(res, 'Privilegio eliminado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

const assignPrivilegeToPermissionRole = async (req, res) => {
    try {
        const { privilegeId, permissionRoleId } = req.body;
        const assigned = await privilegeService.assignPrivilegeToPermissionRole(privilegeId, permissionRoleId);
        sendResponse(res, { message: 'Privilege assigned to PermissionRole successfully', assigned }, 201);
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllPrivileges,
    getPrivilegeById,
    createPrivilege,
    updatePrivilege,
    deletePrivilege,
    createMultiplePrivileges,
    assignPrivilegeToPermissionRole
};