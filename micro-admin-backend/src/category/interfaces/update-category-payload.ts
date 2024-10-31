import { Category } from './category.interface';

export interface updateCategoryPayload {
  id: string;
  updateCategoryDto: Category;
}
