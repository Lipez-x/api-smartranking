import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsCognitoConfig {
  public userPoolId: string = process.env.COGNITO_USER_POOL_ID;
  public clientId: string = process.env.COGNITO_CLIENT_ID;
  public region: string = process.env.AWS_REGION;
  public authority = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;
}
