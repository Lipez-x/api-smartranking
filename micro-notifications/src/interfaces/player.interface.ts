export interface Player extends Document {
  readonly _id: string;
  readonly email: string;
  readonly phoneNumber: string;
  name: string;
  category: string;
  ranking: string;
  rankingPosition: number;
  urlImagePlayer: string;
}
