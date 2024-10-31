import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsString()
  readonly category: string;
  @IsNotEmpty()
  readonly phoneNumber: string;
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly name: string;
}
