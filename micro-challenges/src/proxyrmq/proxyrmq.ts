import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class Proxyrmq {
  private RMQ_USER = process.env.RMQ_USER;
  private RMQ_PASSWORD = process.env.RMQ_PASSWORD;
  private ADDRESS = process.env.ADDRESS;

  private clientChallenges = ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${this.RMQ_USER}:${this.RMQ_PASSWORD}@${this.ADDRESS}/smartranking`,
      ],
      queue: 'challenges',
    },
  });

  public get getClientChallenges() {
    return this.clientChallenges;
  }
}
