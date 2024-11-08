import { Document } from 'mongoose';
import { ChallengeStatus } from '../enums/challenge-status.enum';

export interface Challenge extends Document {
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  requestDateTime: Date;
  responseDateTime: Date;
  applicant: string;
  category: string;
  players: string;
  match: string[];
}
