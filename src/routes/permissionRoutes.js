const express = require('express');
const permissionController = require('../controllers/permissionController');
const validatePermission = require('../middlewares/validatePermission');

const router = express.Router();

router.get('/', permissionController.getAllPermissions);
router.get('/:id', permissionController.getPermissionById);
router.post('/', validatePermission, permissionController.createPermission);
router.put('/:id', validatePermission, permissionController.updatePermission);
router.delete('/:id', permissionController.deletePermission);

module.exports = router;