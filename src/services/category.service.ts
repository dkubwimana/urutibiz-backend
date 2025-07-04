import { getDatabase } from '@/config/database';
import { Category } from '@/types/category.types';
import { v4 as uuidv4 } from 'uuid';

export default class CategoryService {
  static async createCategory(data: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const db = getDatabase();
    const [row] = await db('categories')
      .insert({
        id: uuidv4(),
        name: data.name,
        slug: data.slug,
        description: data.description,
        parent_id: data.parentId,
        image_url: data.imageUrl,
        icon_name: data.iconName,
        sort_order: data.sortOrder || 0,
        is_active: data.isActive ?? true,
        created_at: new Date()
      }, '*');
    return CategoryService.fromDb(row);
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    const db = getDatabase();
    const row = await db('categories').where({ id }).first();
    return row ? CategoryService.fromDb(row) : null;
  }

  static async listCategories(): Promise<Category[]> {
    const db = getDatabase();
    const rows = await db('categories').orderBy('sort_order', 'asc');
    return rows.map(CategoryService.fromDb);
  }

  static fromDb(row: any): Category {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      parentId: row.parent_id,
      imageUrl: row.image_url,
      iconName: row.icon_name,
      sortOrder: row.sort_order,
      isActive: row.is_active,
      createdAt: row.created_at ? row.created_at.toISOString() : '',
    };
  }
}
