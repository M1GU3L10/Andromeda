const productRepository = require('../repositories/productsRepository');

const getAllProducts = async () => {
    return await productRepository.getAllProducts();
};

const getProductById = async (id) => {
    return await productRepository.getProductById(id);
};

const createProduct = async (productData) => {
    console.log('Service: Creating product with data:', productData);
    
    if (!productData.Product_Name || !productData.Price || !productData.Category_Id) {
        throw new Error('Nombre del producto, precio y categoría son obligatorios');
    }

    // If there's image data, ensure it's properly formatted
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

    // If there's new image data, ensure it's properly formatted
    if (productData.Image) {
        productData.Image = Buffer.from(productData.Image);
    }

    try {
        const updatedProduct = await productRepository.updateProduct(id, productData);
        console.log('Service: Product updated successfully:', updatedProduct);
        return updatedProduct;
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
    deleteProduct
};