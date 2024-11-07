import { IsArray, IsNotEmpty } from 'class-validator';
import { Player } from 'src/player/interfaces/player.interface';
import { Result } from '../interfaces/match.interface';

export class AssignChallengeMatch {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  @IsArray()
  result: Array<Result>;
}