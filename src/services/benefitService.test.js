const serviceService = require('./benefitService');
const serviceRepository = require('../repositories/serviceRepository');

jest.mock('../repositories/serviceRepository');

describe('serviceService', () => {

  describe('getAllServices', () => {
    it('should return all services', async () => {
      const services = [
        { id: 1, name: 'Plumbing' },
        { id: 2, name: 'Electrical' }
      ];
      serviceRepository.getAllServices.mockResolvedValue(services);

      const result = await serviceService.getAllServices();
      expect(result).toEqual(services);
      expect(serviceRepository.getAllServices).toHaveBeenCalled();
    });
  });

  describe('getServiceById', () => {
    it('should return a service by id', async () => {
      const service = { id: 1, name: 'Plumbing' };
      serviceRepository.getServiceById.mockResolvedValue(service);

      const result = await serviceService.getServiceById(1);
      expect(result).toEqual(service);
      expect(serviceRepository.getServiceById).toHaveBeenCalledWith(1);
    });

    it('should return null if service is not found', async () => {
      serviceRepository.getServiceById.mockResolvedValue(null);

      const result = await serviceService.getServiceById(999);
      expect(result).toBeNull();
      expect(serviceRepository.getServiceById).toHaveBeenCalledWith(999);
    });
  });

  describe('createService', () => {
    it('should create a service', async () => {
      const data = { name: 'Plumbing' };
      const service = { id: 1, name: 'Plumbing' };

      serviceRepository.createService.mockResolvedValue(service);

      const result = await serviceService.createService(data);
      expect(result).toEqual(service);
      expect(serviceRepository.createService).toHaveBeenCalledWith(data);
    });
  });

  describe('updateService', () => {
    it('should update a service', async () => {
      const id = 1;
      const data = { name: 'Updated Plumbing' };
      const service = { id, name: 'Updated Plumbing' };

      serviceRepository.updateService.mockResolvedValue(service);

      const result = await serviceService.updateService(id, data);
      expect(result).toEqual(service);
      expect(serviceRepository.updateService).toHaveBeenCalledWith(id, data);
    });
  });

  describe('deleteService', () => {
    it('should delete a service', async () => {
      const id = 1;
      serviceRepository.deleteService.mockResolvedValue({});

      const result = await serviceService.deleteService(id);
      expect(result).toEqual({});
      expect(serviceRepository.deleteService).toHaveBeenCalledWith(id);
    });
  });
});