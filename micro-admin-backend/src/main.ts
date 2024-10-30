import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const RMQ_USER = process.env.RMQ_USER;
const RMQ_PASSWORD = process.env.RMQ_PASSWORD;

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${RMQ_USER}:${RMQ_PASSWORD}@3.15.222.109:5672/smartranking`,
      ],
      queue: 'admin-backend',
    },
  });

  await app.listen();
  logger.log('Microservice is listening');
}
bootstrap();
