import { Document } from 'mongoose';

export interface Player extends Document {
  readonly email: string;
  phoneNumber: string;
  name: string;
  ranking: string;
  rankingPosition: number;
  urlImage: string;
}
