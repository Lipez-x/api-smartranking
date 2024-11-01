import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlayerDto {
  @IsNotEmpty()
  readonly phoneNumber: string;
  @IsNotEmpty()
  readonly name: string;
}
