const roleRepository = require('../repositories/roleRepository');
const permissionRepository = require('../repositories/permissionRepository');
const privilegeRepository = require('../repositories/privilegiosRepository');
const privilegePermissionRoleRepository = require('../repositories/privilegePermissionRoleRepository');

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
      await privilege.setPermission(permission);  // Usa setPermission en lugar de addPrivilege
      return true;
  }
  return false;
};

const assignPrivilegesToRole = async (roleId, permissionId, privilegeIds) => {
  const permissionRole = await privilegePermissionRoleRepository.getPrivilegePermissionRoleById(roleId, permissionId);
  if (!permissionRole) {
      throw new Error('PermissionRole not found');
  }

  const assignments = privilegeIds.map(privilegeId => ({
      permissionRoleId: permissionRole.id,
      privilegeId
  }));

  return await privilegePermissionRoleRepository.createMultiplePrivilegePermissionRoles(assignments);
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