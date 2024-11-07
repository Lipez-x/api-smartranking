import { Document } from 'mongoose';
import { Category } from 'src/category/interfaces/category.interface';

export interface Player extends Document {
  readonly email: string;
  phoneNumber: string;
  name: string;
  category: Category;
  ranking: string;
  rankingPosition: number;
  urlImagePlayer: string;
}
