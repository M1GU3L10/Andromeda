const Shopping = require('../models/shopping');
const ShoppingDetail = require('../models/shoppingDetail');
const Product = require('../models/products');
const sequelize = require('../config/database');

const createShopping = async (shoppingData) => {
  const { shoppingDetails, ...shopping } = shoppingData;

  // Iniciar una transacción
  const transaction = await sequelize.transaction();

  try {
    // Crear la compra
    const createdShopping = await Shopping.create(shopping, { include: [ShoppingDetail], transaction });
    console.log('Created Shopping:', createdShopping);

    if (shoppingDetails && shoppingDetails.length > 0) {
      for (const detail of shoppingDetails) {
        // Obtener el producto
        const product = await Product.findByPk(detail.product_id, { transaction });

        if (!product) {
          throw new Error(`Product with ID ${detail.product_id} not found.`);
        }

        // Verificar si el detalle de compra ya existe
        const existingDetail = await ShoppingDetail.findOne({
          where: {
            product_id: detail.product_id,
            shopping_id: createdShopping.id,
          },
          transaction
        });

        if (existingDetail) {
          // Actualizar detalle de compra existente
          const newQuantity = existingDetail.quantity + detail.quantity;
          const newTotalPrice = newQuantity * detail.unit_price;

          await ShoppingDetail.update(
            {
              quantity: newQuantity,
              total_price: newTotalPrice,
            },
            {
              where: {
                id: existingDetail.id,
              },
              transaction
            }
          );
        } else {
          // Crear nuevo detalle de compra
          await ShoppingDetail.create({
            ...detail,
            shopping_id: createdShopping.id,
          }, { transaction });
        }

        // Actualizar el stock del producto
        await Product.update(
          {
            Stock: product.Stock + detail.quantity, // Sumar la cantidad al stock existente
          },
          {
            where: {
              id: product.id,
            },
            transaction
          }
        );
      }
    }

    // Confirmar la transacción
    await transaction.commit();
    console.log('Transaction committed.');

    return createdShopping;
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    console.error('Transaction rolled back:', error);
    throw error;
  }
};

const getShoppingById = async (id) => {
  return await Shopping.findByPk(id, { include: [ShoppingDetail] });
};

const getShoppingAll = async () => {
  return await Shopping.findAll({
    include: [ShoppingDetail]
  });
};

module.exports = {
  createShopping,
  getShoppingById,
  getShoppingAll
};