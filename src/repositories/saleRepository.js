const Sale = require('../models/sale');
const SaleDetail = require('../models/saleDetail');
const productRepository = require('./productsRepository');
const sequelize = require('../config/database');
const { Transaction } = require('sequelize');
const { models } = require('../models');

const createSale = async (saleData) => {
    const { saleDetails, ...sale } = saleData;

    const Transaction = await sequelize.transaction();

    try {
        const createdSale = await Sale.create(sale, {
            include: [SaleDetail],
            Transaction
        });

        if (saleDetails) {
            const detailsWithSaleId = saleDetails.map(detail => ({
                ...detail,
                id_sale: createdSale.id,
            }));
            await SaleDetail.bulkCreate(detailsWithSaleId, { Transaction });

            await productRepository.updateProductStock(detailsWithSaleId,Transaction);
        }

        await Transaction.commit();
        return createdSale;
    } catch (error) {
        await Transaction.rollback();
        throw error;
    }
};

const getSaleById = async (id) => {
    return await Sale.findByPk(id, { include: [SaleDetail] });
};

const getSaleAll = async () => {
    return await Sale.findAll({
        include: [SaleDetail]
    });
};

const updateStatusSales = async (id, status) => {
    return await models.Sale.update(status, {
        where: { id }
    });
};


module.exports = {
    createSale,
    getSaleById,
    getSaleAll,
    updateStatusSales
};