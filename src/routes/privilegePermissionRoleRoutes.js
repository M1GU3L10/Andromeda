const express = require('express');
const privilegePermissionRoleController = require('../controllers/privilegePermissionRoleController');

const router = express.Router();

router.get('/', privilegePermissionRoleController.getAllPrivilegePermissionRoles);
router.get('/:id', privilegePermissionRoleController.getPrivilegePermissionRoleById);
router.post('/', privilegePermissionRoleController.createPrivilegePermissionRole);
router.put('/:id', privilegePermissionRoleController.updatePrivilegePermissionRole);
router.delete('/:id', privilegePermissionRoleController.deletePrivilegePermissionRole);

module.exports = router;