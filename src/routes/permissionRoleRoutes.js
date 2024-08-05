const express = require('express');
const permissionRoleController = require('../controllers/permissionRoleController');
const validatePermissionRole = require('../middlewares/validatePermissionRole');

const router = express.Router();

router.get('/', permissionRoleController.getAllPermissionsRoles);
router.get('/:id', permissionRoleController.getPermissionRoleById);
router.post('/', validatePermissionRole, permissionRoleController.createPermissionRole);
router.put('/:id', validatePermissionRole, permissionRoleController.updatePermissionRole);
router.delete('/:id', permissionRoleController.deletePermissionRole);

module.exports = router;