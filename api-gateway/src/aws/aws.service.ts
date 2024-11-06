import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);
  private S3_USER_ACCESS_KEY_ID = process.env.S3_USER_ACCESS_KEY_ID;
  private S3_USER_SECRET_ACCESS_KEY = process.env.S3_USER_SECRET_ACCESS_KEY;
  private AWS_REGION = process.env.AWS_REGION;
  private AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;

  public async uploadFile(file: any, id: string) {
    const s3 = new AWS.S3({
      region: this.AWS_REGION,
      accessKeyId: this.S3_USER_ACCESS_KEY_ID,
      secretAccessKey: this.S3_USER_SECRET_ACCESS_KEY,
    });

    const fileExtension = file.originalname.split('.')[1];

    const urlKey = `${id}.${fileExtension}`;
    this.logger.log(`url: ${urlKey}`);

    const params = {
      Body: file.buffer,
      Bucket: 'user-images-smartranking',
      Key: urlKey,
    };

    const data = s3
      .putObject(params)
      .promise()
      .then(
        (data) => {
          return {
            url: `https://${this.AWS_S3_BUCKET}.s3.${this.AWS_REGION}.amazonaws.com/${urlKey}`,
          };
        },
        (error) => {
          this.logger.error(error);
          return error;
        },
      );

    return data;
  }
}
