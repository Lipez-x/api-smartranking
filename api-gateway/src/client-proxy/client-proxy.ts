import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxyProvider {
  private clientAdminBackend: ClientProxy;
  private clientChallenges: ClientProxy;

  private RMQ_USER = process.env.RMQ_USER;
  private RMQ_PASSWORD = process.env.RMQ_PASSWORD;
  private ADDRESS = process.env.ADDRESS;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${this.RMQ_USER}:${this.RMQ_PASSWORD}@${this.ADDRESS}/smartranking`,
        ],
        queue: 'admin-backend',
      },
    });

    this.clientChallenges = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${this.RMQ_USER}:${this.RMQ_PASSWORD}@${this.ADDRESS}/smartranking`,
        ],
        queue: 'challenges',
      },
    });
  }

  public get getClientAdminBackEnd() {
    return this.clientAdminBackend;
  }

  public get getClientChallenges() {
    return this.clientChallenges;
  }
}
export { ClientProxy };
