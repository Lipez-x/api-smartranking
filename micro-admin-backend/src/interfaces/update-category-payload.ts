import { Category } from '../category/interfaces/category.interface';

export interface updateCategoryPayload {
  id: string;
  updateCategoryDto: Category;
}
