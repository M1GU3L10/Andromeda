// controllers/roleController.js
const roleService = require('../services/roleService');
const permissionService = require('../services/permissionService');
const { sequelize } = require('../models');
const { Role, PermissionRole } = require('../models');
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
      const role = await roleService.createRole({ name, status }, permissions);
      sendResponse(res, { message: 'Role created successfully', role }, 201);
    } catch (error) {
      sendError(res, error);
    }
  };

  const updateRole = async (req, res) => {
    try {
      const { name, status, permissions } = req.body;
      const { id } = req.params;
      const role = await roleService.updateRole(id, { name, status }, permissions);
      sendResponse(res, { message: 'Role updated successfully', role });
    } catch (error) {
      sendError(res, error);
    }
  };

const deleteRole = async (req, res) => {
    const { id } = req.params;

    try {
        // Asegúrate de que PermissionRole esté importado correctamente
        const PermissionRole = require('../models/permissionRole'); // Asegúrate de que esta ruta sea correcta

        // Primero, eliminar las asociaciones en la tabla intermedia
        const deletedAssociations = await PermissionRole.destroy({
            where: { roleId: id }
        });

        console.log(`Número de asociaciones eliminadas: ${deletedAssociations}`);

        // Luego, eliminar el rol
        const Role = require('../models/role');
        const deletedRole = await Role.destroy({
            where: { id }
        });

        if (!deletedRole) {
            return res.status(404).json({ message: 'El rol no fue encontrado o ya fue eliminado.' });
        }

        res.status(200).json({ message: 'El rol y los permisos asociados fueron eliminados correctamente.' });
    } catch (error) {
        console.error(`Error al eliminar el rol: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const assignPrivilegeToPermission = async (req, res) => {
    try {
        const { permissionId, privilegeId } = req.body;
        const assigned = await roleService.assignPrivilegeToPermission(permissionId, privilegeId);
        if (!assigned) {
            return sendError(res, 'No se pudo asignar el privilegio al permiso', 400);
        }
        sendResponse(res, 'Privilegio asignado correctamente al permiso');
    } catch (error) {
        sendError(res, error);
    }
};

const assignPrivilegesToRole = async (req, res) => {
    try {
        const { roleId, permissionId, privilegeIds } = req.body;
        const assigned = await roleService.assignPrivilegesToRole(roleId, permissionId, privilegeIds);
        sendResponse(res, { message: 'Privileges assigned to Role successfully', assigned }, 201);
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    assignPrivilegeToPermission,
    assignPrivilegesToRole
};
