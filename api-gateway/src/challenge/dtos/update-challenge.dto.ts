import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UpdateChallengeStatusEnum } from '../enums/update-challenge-status.enum';

export class UpdateChallengeDto {
  dateTimeChallenge: Date;

  @IsOptional()
  @IsEnum(UpdateChallengeStatusEnum)
  status: UpdateChallengeStatusEnum;
}
