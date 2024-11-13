import { ChallengeStatus } from '../enums/challenge-status.enum';

export interface Challenge {
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  requestDateTime: Date;
  responseDateTime?: Date;
  applicant: string;
  category: string;
  players: string[];
  match?: string;
}