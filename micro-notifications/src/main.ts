import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

const RMQ_USER = process.env.RMQ_USER;
const RMQ_PASSWORD = process.env.RMQ_PASSWORD;
const ADDRESS = process.env.ADDRESS;

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${RMQ_USER}:${RMQ_PASSWORD}@${ADDRESS}/smartranking`],
      noAck: false,
      queue: 'notifications',
    },
  });

  await app.listen();
}
bootstrap();
