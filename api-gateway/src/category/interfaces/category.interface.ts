import { Player } from 'src/player/interfaces/player.interface';
import { Event } from './event.interface';

export interface Category {
  category: string;
  description: string;
  events: Array<Event>;
  players: Array<Player>;
}
