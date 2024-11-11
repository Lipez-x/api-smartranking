export interface ProcessMatchPayload {
  matchId: string;
  match: {
    category: string;
    challenge: string;
    players: string[];
    def: string;
    result: Array<Result>;
  };
}

export interface Result {
  set: string;
}
