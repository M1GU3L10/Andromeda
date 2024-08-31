const express = require('express');
const absenceController = require('../controllers/absenceController');
const validateAbsence = require('../middlewares/validateAbsence');

const router = express.Router();

router.get('/', absenceController.getAllAbsences);
router.get('/:id', absenceController.getAbsenceById);
router.post('/', validateAbsence.validateAbsence, absenceController.createAbsence);
router.put('/:id', validateAbsence.validateAbsencesUpdate, absenceController.updateAbsence);
router.delete('/:id', absenceController.deleteAbsence);

module.exports = router;