import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import * as moment from 'moment-timezone';

const RMQ_USER = process.env.RMQ_USER;
const RMQ_PASSWORD = process.env.RMQ_PASSWORD;
const ADDRESS = process.env.ADDRESS;

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${RMQ_USER}:${RMQ_PASSWORD}@${ADDRESS}/smartranking`],
      noAck: false,
      queue: 'admin-backend',
    },
  });

  Date.prototype.toJSON = function (): any {
    return moment(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen();
}
bootstrap();
