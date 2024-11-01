import { Player } from './player.interface';

export interface UpdatePlayerPayload {
  id: string;
  updatePlayerDto: Player;
}
