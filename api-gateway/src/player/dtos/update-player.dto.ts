import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlayerDto {
  @IsNotEmpty()
  @IsString()
  readonly categoryId: string;
  @IsNotEmpty()
  readonly phoneNumber: string;
  @IsNotEmpty()
  readonly name: string;
}
