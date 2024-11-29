const absenceService = require('./absenceService');
const absenceRepository = require('../repositories/absenceRepository');

jest.mock('../repositories/absenceRepository');

describe('absenceService', () => {

  describe('getAllAbsences', () => {
    it('should return all absences', async () => {
      const absences = [
        { id: 1, reason: 'Sick leave' },
        { id: 2, reason: 'Personal leave' }
      ];
      absenceRepository.getAllabsences.mockResolvedValue(absences);

      const result = await absenceService.getAllAbsences();
      expect(result).toEqual(absences);
      expect(absenceRepository.getAllabsences).toHaveBeenCalled();
    });
  });

  describe('getAbsenceById', () => {
    it('should return an absence by id', async () => {
      const absence = { id: 1, reason: 'Sick leave' };
      absenceRepository.getAbsenceById.mockResolvedValue(absence);

      const result = await absenceService.getAbsenceById(1);
      expect(result).toEqual(absence);
      expect(absenceRepository.getAbsenceById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if absence is not found', async () => {
      absenceRepository.getAbsenceById.mockResolvedValue(null);

      await expect(absenceService.getAbsenceById(999)).rejects.toThrow('Absence not found');
    });
  });

  describe('createAbsence', () => {
    it('should create an absence', async () => {
      const data = { reason: 'Sick leave', startDate: '2024-11-01', endDate: '2024-11-05' };
      const absence = { id: 1, ...data };

      absenceRepository.createAbsence.mockResolvedValue(absence);
      
      const result = await absenceService.createAbsence(data);
      expect(result).toEqual(absence);
      expect(absenceRepository.createAbsence).toHaveBeenCalledWith(data);
    });
  });

  describe('updateAbsence', () => {
    it('should update an absence', async () => {
      const id = 1;
      const data = { reason: 'Personal leave', startDate: '2024-11-01', endDate: '2024-11-03' };
      const absence = { id, ...data };

      absenceRepository.updateAbsence.mockResolvedValue(absence);

      const result = await absenceService.updateAbsence(id, data);
      expect(result).toEqual(absence);
      expect(absenceRepository.updateAbsence).toHaveBeenCalledWith(id, data);
    });
  });

  describe('deleteAbsence', () => {
    it('should delete an absence', async () => {
      const id = 1;
      absenceRepository.deleteAbsence.mockResolvedValue({});

      const result = await absenceService.deleteAbsence(id);
      expect(result).toEqual({});
      expect(absenceRepository.deleteAbsence).toHaveBeenCalledWith(id);
    });
  });
});
