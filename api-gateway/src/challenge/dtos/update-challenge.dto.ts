import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UpdateChallengeStatusEnum } from '../enums/update-challenge-status.enum';

export class UpdateChallengeDto {
  @IsOptional()
  @IsEnum(UpdateChallengeStatusEnum)
  status: UpdateChallengeStatusEnum;
}
