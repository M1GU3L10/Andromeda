const productService = require('../services/productsService');
const { sendResponse, sendError } = require('../utils/response');

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        sendResponse(res, product, 201);
    } catch (error) {
        sendError(res, error);
    }
};

const getAllProducts = async (req, res) => {
    try {
      const products = await productService.getAllProducts();
      // Convert image buffer to base64 string for each product
      const productsWithImageUrls = products.map(product => ({
        ...product.toJSON(),
        Image: product.Image ? `data:${product.ImageMimeType};base64,${product.Image.toString('base64')}` : null
      }));
      sendResponse(res, productsWithImageUrls);
    } catch (error) {
      sendError(res, error);
    }
};

const getProductById = async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return sendError(res, 'Producto no encontrado', 404);
      }
      // Convert image buffer to base64 string
      const productWithImageUrl = {
        ...product.toJSON(),
        Image: product.Image ? `data:${product.ImageMimeType};base64,${product.Image.toString('base64')}` : null
      };
      sendResponse(res, productWithImageUrl);
    } catch (error) {
      sendError(res, error);
    }
};

const updateProduct = async (req, res) => {
  try {
      const { id } = req.params;
      const productData = req.body; // Obtiene todos los datos del cuerpo de la solicitud

      const updatedProduct = await productService.updateProduct(id, productData);
      sendResponse(res, updatedProduct); // Envía el producto actualizado
  } catch (error) {
      sendError(res, error);
  }
};

const updateProductStatus = async (req, res) => {
  try {
      const { id } = req.params;
      const { status } = req.body; // Solo obtiene el estado

      const updatedStatus = await productService.updateProductStatus(id, status);
      if (!updatedStatus) {
          return sendError(res, 'Producto no encontrado', 404);
      }
      sendResponse(res, 'Estado del producto actualizado correctamente');
  } catch (error) {
      sendError(res, error);
  }
};



const deleteProduct = async (req, res) => {
    try {
        const deleted = await productService.deleteProduct(req.params.id);
        if (deleted === 0) {
            return sendError(res, 'Producto no encontrado', 404);
        }
        sendResponse(res, 'Producto eliminado correctamente');
    } catch (error) {
        sendError(res, error);
    }
};


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus
};