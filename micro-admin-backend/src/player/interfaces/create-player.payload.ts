import { Player } from './player.interface';

export interface CreatePlayerPayload {
  categoryId: string;
  phoneNumber: string;
  email: string;
  name: string;
}
