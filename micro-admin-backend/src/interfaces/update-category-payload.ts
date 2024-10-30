import { Category } from './categories/category.interface';

export interface updateCategoryPayload {
  id: string;
  updateCategoryDto: Category;
}
