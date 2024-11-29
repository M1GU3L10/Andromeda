const roleService = require('./roleService');
const roleRepository = require('../repositories/roleRepository');

jest.mock('../repositories/roleRepository');

describe('roleService', () => {

  describe('getAllRoles', () => {
    it('should return all roles', async () => {
      const roles = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' }
      ];
      roleRepository.getAllRoles.mockResolvedValue(roles);

      const result = await roleService.getAllRoles();
      expect(result).toEqual(roles);
      expect(roleRepository.getAllRoles).toHaveBeenCalled();
    });
  });

  describe('getRoleById', () => {
    it('should return a role by id', async () => {
      const role = { id: 1, name: 'Admin' };
      roleRepository.getRoleById.mockResolvedValue(role);

      const result = await roleService.getRoleById(1);
      expect(result).toEqual(role);
      expect(roleRepository.getRoleById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if role is not found', async () => {
      roleRepository.getRoleById.mockResolvedValue(null);

      await expect(roleService.getRoleById(999)).rejects.toThrow('Role not found');
    });
  });

  describe('createRole', () => {
    it('should create a role', async () => {
      const data = { name: 'Admin' };
      const role = { id: 1, name: 'Admin' };

      roleRepository.createRole.mockResolvedValue(role);
      
      const result = await roleService.createRole(data);
      expect(result).toEqual(role);
      expect(roleRepository.createRole).toHaveBeenCalledWith(data);
    });
  });

  describe('updateRole', () => {
    it('should update a role', async () => {
      const id = 1;
      const data = { name: 'Admin Updated' };
      const role = { id, name: 'Admin Updated' };

      roleRepository.updateRole.mockResolvedValue(role);

      const result = await roleService.updateRole(id, data);
      expect(result).toEqual(role);
      expect(roleRepository.updateRole).toHaveBeenCalledWith(id, data);
    });
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      const id = 1;
      roleRepository.deleteRole.mockResolvedValue({});

      const result = await roleService.deleteRole(id);
      expect(result).toEqual({});
      expect(roleRepository.deleteRole).toHaveBeenCalledWith(id);
    });
  });
});
