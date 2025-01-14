import { Player } from 'src/player/interfaces/player.interface';

export interface Match {
  category?: string;
  challenge?: string;
  players?: Array<Player>;
  def?: Player;
  result?: Array<Result>;
}

export interface Result {
  set: string;
}
