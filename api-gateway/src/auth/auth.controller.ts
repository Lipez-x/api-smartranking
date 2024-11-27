import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthRegisterUserDto } from './dtos/auth-register-user';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { ChangePasswordDto } from './dtos/auth-change-password.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import { AuthConfirmPasswordDto } from './dtos/auth-confirm-password.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly awsCognitoService: AwsCognitoService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() authRegisterUserDto: AuthRegisterUserDto) {
    return await this.awsCognitoService.userRegister(authRegisterUserDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() authLoginUserDto: AuthLoginUserDto) {
    return await this.awsCognitoService.authUser(authLoginUserDto);
  }

  @Post('/change-password')
  @UsePipes(ValidationPipe)
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const result =
      await this.awsCognitoService.changeUserPassword(changePasswordDto);

    if (result == 'SUCCESS') {
      return {
        status: 'success',
      };
    }
  }

  @Post('forgot-password')
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() authForgotPasswordDto: AuthForgotPasswordDto) {
    return await this.awsCognitoService.forgotUserPassword(
      authForgotPasswordDto,
    );
  }

  @Post('confirm-password')
  @UsePipes(ValidationPipe)
  async confirmPassword(
    @Body() authConfirmPasswordDto: AuthConfirmPasswordDto,
  ) {
    return await this.awsCognitoService.confirmUserPassword(
      authConfirmPasswordDto,
    );
  }
}
