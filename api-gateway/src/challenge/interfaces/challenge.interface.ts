import { Player } from 'src/player/interfaces/player.interface';
import { ChallengeStatus } from '../enums/challenge-status.enum';
import { Document } from 'mongoose';
import { Match } from './match.interface';

export interface Challenge extends Document {
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  requestDateTime: Date;
  responseDateTime: Date;
  applicant: Player;
  category: string;
  match: Match;
  players: Array<Player>;
}
