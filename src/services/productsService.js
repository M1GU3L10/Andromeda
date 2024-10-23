const productRepository = require('../repositories/productsRepository');
const Product = require('../models/products');  // Importa el modelo Product aquí

const getAllProducts = async () => {
    return await productRepository.getAllProducts();
};

const getProductById = async (id) => {
    return await productRepository.getProductById(id);
};

const updateProductStatus = async (id, status) => {
    const product = await Product.findByPk(id);  // Usa el modelo Product para buscar el producto por su ID
    if (!product) {
        return null;
    }
    product.status = status;
    await product.save();
    return product;
};

const createProduct = async (productData) => {
    console.log('Service: Creating product with data:', productData);

    if (!productData.Product_Name || !productData.Price || !productData.Category_Id) {
        throw new Error('Nombre del producto, precio y categoría son obligatorios');
    }

    // Si hay datos de imagen, asegúrate de que estén formateados correctamente
    if (productData.Image) {
        productData.Image = Buffer.from(productData.Image);
    }

    try {
        const createdProduct = await productRepository.createProduct(productData);
        console.log('Service: Product created successfully:', createdProduct);
        return createdProduct;
    } catch (error) {
        console.error('Service: Error creating product:', error);
        throw new Error(`Error al crear el producto: ${error.message}`);
    }
};

const updateProduct = async (id, productData) => {
  console.log('Service: Updating product with id:', id, 'and data:', productData);
  
  if (!id) {
      throw new Error('ID del producto es obligatorio');
  }

  // Busca el producto por su ID
  const product = await Product.findByPk(id);
  if (!product) {
      throw new Error('Producto no encontrado');
  }

  // Actualiza el estado del producto si se proporciona
  if (productData.status) {
      product.status = productData.status;
  }

  // Actualiza otros campos del producto
  if (productData.Product_Name) {
      product.Product_Name = productData.Product_Name;
  }
  if (productData.Price) {
      product.Price = productData.Price;
  }
  if (productData.Category_Id) {
      product.Category_Id = productData.Category_Id;
  }
  // Si hay nuevos datos de imagen, asegúrate de que estén en el formato correcto
  if (productData.Image) {
      productData.Image = Buffer.from(productData.Image);
      product.Image = productData.Image; // Actualiza la imagen también
  }

  try {
      await product.save();
      console.log('Service: Product updated successfully:', product);
      return product;
  } catch (error) {
      console.error('Service: Error updating product:', error);
      throw new Error(`Error al actualizar el producto: ${error.message}`);
  }
};



const deleteProduct = async (id) => {
    return await productRepository.deleteProduct(id);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    updateProductStatus,  // Asegúrate de exportar la función updateProductStatus
    deleteProduct,
 
};
