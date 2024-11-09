import { Match } from './match.model';

export interface CreateMatchPayload {
  id: string;
  assignChallengeMatchDto: Match;
}
