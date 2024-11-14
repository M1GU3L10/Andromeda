const roleRepository = require('../repositories/roleRepository');
const permissionRepository = require('../repositories/permissionRepository');
const privilegeRepository = require('../repositories/privilegiosRepository');

const getAllRoles = async () => {
    return await roleRepository.getAllRoles();
};

const getRoleById = async (id) => {
    return await roleRepository.getRoleById(id);
};

const createRole = async (data, permissions) => {
    const role = await roleRepository.createRole(data);
    if (permissions) {
      await role.setPermissions(permissions);
    }
    return role;
  };

  const updateRole = async (id, data, permissions) => {
    const role = await roleRepository.updateRole(id, data);
    if (permissions) {
      await role.setPermissions(permissions);
    }
    return role;
  };

const deleteRole = async (id) => {
    return await roleRepository.deleteRole(id);
};

const assignPrivilegeToPermission = async (permissionId, privilegeId) => {
    const permission = await permissionRepository.getPermissionById(permissionId);
    const privilege = await privilegeRepository.getPrivilegeById(privilegeId);
    if (permission && privilege) {
        await permission.addPrivilege(privilege);
        return true;
    }
    return false;
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    assignPrivilegeToPermission
};