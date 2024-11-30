const suppliersService = require('./suppliersService');
const supplierRepository = require('../repositories/suppliersRepository');

// Mock de suppliersRepository
jest.mock('../repositories/suppliersRepository', () => ({
    getAllSuppliers: jest.fn(),
    createSupplier: jest.fn(),
    getSupplierById: jest.fn(),
    updateSupplier: jest.fn(),
    deleteSupplier: jest.fn(),
}));

describe('suppliersService with mocks', () => {
    it('should get all suppliers (mocked)', async () => {
        // Simulamos que getAllSuppliers devuelve una lista de proveedores
        supplierRepository.getAllSuppliers.mockResolvedValue([{ id: 1, name: 'Supplier A' }]);

        const result = await suppliersService.getAllSuppliers();
        expect(result).toEqual([{ id: 1, name: 'Supplier A' }]);
        expect(supplierRepository.getAllSuppliers).toHaveBeenCalledTimes(1); // Verificamos que la función fue llamada una vez
    });

    it('should create a supplier (mocked)', async () => {
        const newSupplier = { name: 'New Supplier' };
        
        // Simulamos que createSupplier devuelve el proveedor con id
        supplierRepository.createSupplier.mockResolvedValue({ id: 1, ...newSupplier });

        const result = await suppliersService.createSupplier(newSupplier);
        expect(result).toEqual({ id: 1, name: 'New Supplier' });
        expect(supplierRepository.createSupplier).toHaveBeenCalledWith(newSupplier); // Verificamos que fue llamada con los datos correctos
    });

    it('should get supplier by ID (mocked)', async () => {
        const supplier = { id: 1, name: 'Supplier A' };
        
        // Simulamos que getSupplierById devuelve un proveedor por su id
        supplierRepository.getSupplierById.mockResolvedValue(supplier);

        const result = await suppliersService.getSupplierById(1);
        expect(result).toEqual(supplier);
        expect(supplierRepository.getSupplierById).toHaveBeenCalledWith(1); // Verificamos que fue llamada con el ID correcto
    });

    it('should update a supplier (mocked)', async () => {
        const updatedSupplier = { id: 1, name: 'Updated Supplier' };

        // Simulamos que updateSupplier devuelve el proveedor actualizado
        supplierRepository.updateSupplier.mockResolvedValue(updatedSupplier);

        const result = await suppliersService.updateSupplier(1, updatedSupplier);
        expect(result).toEqual(updatedSupplier);
        expect(supplierRepository.updateSupplier).toHaveBeenCalledWith(1, updatedSupplier); // Verificamos que fue llamada con los datos correctos
    });

    it('should delete a supplier (mocked)', async () => {
        // Simulamos que deleteSupplier no devuelve nada, ya que es una operación de eliminación
        supplierRepository.deleteSupplier.mockResolvedValue(undefined);

        const result = await suppliersService.deleteSupplier(1);
        expect(result).toBeUndefined(); // Verificamos que no se devuelve nada
        expect(supplierRepository.deleteSupplier).toHaveBeenCalledWith(1); // Verificamos que fue llamada con el ID correcto
    });
});
