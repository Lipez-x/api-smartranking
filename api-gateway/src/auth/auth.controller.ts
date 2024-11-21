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
}
