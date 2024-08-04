const express = require('express');
const programmingEmployeeController = require('../controllers/programmingEmployeeController');
const validateProgrammingEmployee = require('../middlewares/validateProgrammingEmployee');

const router = express.Router();

router.get('/', programmingEmployeeController.getAllProgrammingemployees);
router.get('/:id', programmingEmployeeController.getProgrammingemployeesById);
router.post('/', validateProgrammingEmployee, programmingEmployeeController.createProgrammingemployees);
router.put('/:id', validateProgrammingEmployee, programmingEmployeeController.updateProgrammingemployees);
router.delete('/:id', programmingEmployeeController.deleteprogrammingEmployee);

module.exports = router;