import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlayerDto {
  @IsNotEmpty()
  @IsString()
  readonly category: string;
  @IsNotEmpty()
  readonly phoneNumber: string;
  @IsNotEmpty()
  readonly name: string;
}
