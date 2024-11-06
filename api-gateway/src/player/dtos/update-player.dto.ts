import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePlayerDto {
  @IsOptional()
  urlImagePlayer?: string;

  @IsOptional()
  categoryId?: string;

  /*
  @IsNotEmpty()
  readonly phoneNumber: string;
  @IsNotEmpty()
  readonly name: string;
*/
}
