import { Request, Response } from 'express';
import CategoryService from '../services/category.service';

export default class CategoryController {
  static async createCategory(req: Request, res: Response) {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create category', details: err instanceof Error ? err.message : String(err) });
    }
  }

  static async getCategoryById(req: Request, res: Response) {
    const { id } = req.params;
    const category = await CategoryService.getCategoryById(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  }

  static async listCategories(_req: Request, res: Response) {
    const categories = await CategoryService.listCategories();
    res.json(categories);
  }
}
