import { ChallengeStatus } from '../enums/challenge-status.enum';

export interface UpdateChallengePayload {
  id: string;
  updateChallengeDto: {
    status: ChallengeStatus;
  };
}
