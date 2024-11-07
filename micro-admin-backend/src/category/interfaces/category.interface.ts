import { Document } from 'mongoose';
import { Player } from '../../player/interfaces/player.interface';

export interface Category extends Document {
  category: string;
  description: string;
  events: Array<Event>;
  players: Array<Player>;
}

interface Event {
  name: string;
  operation: string;
  value: number;
}
