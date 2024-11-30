const categoryService = require('./categoryService');
const categoryRepository = require('../repositories/categoryRepository');
const productRepository = require('../repositories/productsRepository');

jest.mock('../repositories/categoryRepository');
jest.mock('../repositories/productsRepository');

describe('categoryService', () => {

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const categories = [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Clothing' }
      ];
      categoryRepository.getAllCategories.mockResolvedValue(categories);

      const result = await categoryService.getAllCategories();
      expect(result).toEqual(categories);
      expect(categoryRepository.getAllCategories).toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      const category = { id: 1, name: 'Electronics' };
      categoryRepository.getCategoryById.mockResolvedValue(category);

      const result = await categoryService.getCategoryById(1);
      expect(result).toEqual(category);
      expect(categoryRepository.getCategoryById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if category is not found', async () => {
      categoryRepository.getCategoryById.mockResolvedValue(null);

      await expect(categoryService.getCategoryById(999)).rejects.toThrow('Category not found');
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const data = { name: 'Electronics' };
      const category = { id: 1, name: 'Electronics' };

      categoryRepository.createCategory.mockResolvedValue(category);

      const result = await categoryService.createCategory(data);
      expect(result).toEqual(category);
      expect(categoryRepository.createCategory).toHaveBeenCalledWith(data);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const id = 1;
      const data = { name: 'Updated Electronics' };
      const category = { id, name: 'Updated Electronics' };

      categoryRepository.updateCategory.mockResolvedValue(category);

      const result = await categoryService.updateCategory(id, data);
      expect(result).toEqual(category);
      expect(categoryRepository.updateCategory).toHaveBeenCalledWith(id, data);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const id = 1;
      categoryRepository.deleteCategory.mockResolvedValue({});

      const result = await categoryService.deleteCategory(id);
      expect(result).toEqual({});
      expect(categoryRepository.deleteCategory).toHaveBeenCalledWith(id);
    });
  });

  describe('verifyCategoryAssociation', () => {
    it('should return true if the category has associated products', async () => {
      const categoryId = 1;
      const products = [{ id: 1, name: 'Laptop', categoryId }];
      productRepository.checkCategoryAssociation.mockResolvedValue(products);

      const result = await categoryService.verifyCategoryAssociation(categoryId);
      expect(result).toBe(true);
      expect(productRepository.checkCategoryAssociation).toHaveBeenCalledWith(categoryId);
    });

    it('should return false if the category has no associated products', async () => {
      const categoryId = 2;
      productRepository.checkCategoryAssociation.mockResolvedValue([]);

      const result = await categoryService.verifyCategoryAssociation(categoryId);
      expect(result).toBe(false);
      expect(productRepository.checkCategoryAssociation).toHaveBeenCalledWith(categoryId);
    });
  });
});
