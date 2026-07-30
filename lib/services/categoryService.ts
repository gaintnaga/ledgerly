import { categoryRepository } from "../repositories/categoryRepository";

export const categoryService = {
  async getAllCategories() {
    return await categoryRepository.findAll();
  },

  async getCategoryById(id: string) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  },

  async createCategory(data: { name: string; description?: string }) {
    const existingCategory = await categoryRepository.findByName(data.name);

    if (existingCategory) {
      throw new Error("Category already exists");
    }
    return await categoryRepository.create(data);
  },

  async updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    if (data.name && data.name !== category.name) {
      const existingCategory = await categoryRepository.findByName(data.name);

      if (existingCategory) {
        throw new Error("Category name already exists");
      }
    }

    return await categoryRepository.update(id, data);
  },

  async deleteCategory(id: string) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return await categoryRepository.delete(id);
  },
};