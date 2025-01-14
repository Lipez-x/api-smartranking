import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthRegisterUserDto } from 'src/auth/dtos/auth-register-user';
import { AwsCognitoConfig } from './aws-cognito.config';
import { AuthLoginUserDto } from 'src/auth/dtos/auth-login-user.dto';
import { ChangePasswordDto } from 'src/auth/dtos/auth-change-password.dto';
import { AuthForgotPasswordDto } from 'src/auth/dtos/auth-forgot-password.dto';
import { AuthConfirmPasswordDto } from 'src/auth/dtos/auth-confirm-password.dto';
@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;
  constructor(private authConfig: AwsCognitoConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }
  async userRegister(authRegisterUserDto: AuthRegisterUserDto) {
    const { name, email, password, phoneNumber } = authRegisterUserDto;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: phoneNumber,
          }),
          new CognitoUserAttribute({
            Name: 'name',
            Value: name,
          }),
        ],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async authUser(authLoginUserDto: AuthLoginUserDto) {
    const { email, password } = authLoginUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async changeUserPassword(changePasswordDto: ChangePasswordDto) {
    const { email, currentPassword, newPassword } = changePasswordDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: currentPassword,
    });

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          cognitoUser.changePassword(
            currentPassword,
            newPassword,
            (err, result) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(result);
            },
          );
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async forgotUserPassword(authForgotPasswordDto: AuthForgotPasswordDto) {
    const { email } = authForgotPasswordDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async confirmUserPassword(authConfirmPasswordDto: AuthConfirmPasswordDto) {
    const { email, confirmationCode, newPassword } = authConfirmPasswordDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(confirmationCode, newPassword, {
        onSuccess: () => {
          resolve({
            status: 'success',
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
