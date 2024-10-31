import { Player } from '../../interfaces/players/player.interface';

export interface Category extends Document {
  readonly category: string;
  description: string;
  events: Array<Event>;
  players: Array<Player>;
}

interface Event {
  name: string;
  operation: string;
  value: number;
}
