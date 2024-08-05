const SupplierService = require('../services/suppliersService');
const { sendResponse, sendError } = require('../utils/response');

const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await SupplierService.getAllSuppliers();
        sendResponse(res, suppliers);
    } catch (error) {
        sendError(res, error);
    }
};

const getSupplierById = async (req, res) => {
    try {
        const supplier = await SupplierService.getSupplierById(req.params.id);
        if (!supplier) {
            return sendError(res, 'Proveedor no encontrado', 404);
        }
        sendResponse(res, supplier);
    } catch (error) {
        sendError(res, error);
    }
};

const createSupplier = async (req, res) => {
    try {
        const supplier = await SupplierService.createSupplier(req.body);
        sendResponse(res, supplier, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const updateSupplier = async (req, res) => {
    try {
        const updated = await SupplierService.updateSupplier(req.params.id, req.body);
        if (updated[0] === 0) {
            return sendError(res, 'Proveedor no encontrado', 404);
        }
        sendResponse(res, 'Proveedor actualizado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const deleted = await SupplierService.deleteSupplier(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Proveedor no encontrado', 404);
        }
        sendResponse(res, 'Proveedor eliminado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
