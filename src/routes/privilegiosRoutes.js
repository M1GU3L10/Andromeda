const express = require('express');
const privilegeController = require('../controllers/privilegiosController');

const router = express.Router();

router.get('/', privilegeController.getAllPrivileges);
router.get('/:id', privilegeController.getPrivilegeById);
router.put('/:id',  privilegeController.updatePrivilege);
router.delete('/:id', privilegeController.deletePrivilege);
router.post('/multiple', privilegeController.createMultiplePrivileges);
router.post('/assign', privilegeController.assignPrivilegeToPermissionRole);

module.exports = router;