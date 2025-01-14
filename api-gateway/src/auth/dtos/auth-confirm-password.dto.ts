import { IsEmail, IsString, Matches } from 'class-validator';

export class AuthConfirmPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  confirmationCode: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Invalid password',
  })
  newPassword: string;
}
