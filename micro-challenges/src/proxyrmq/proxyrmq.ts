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

  private clientRankings = ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${this.RMQ_USER}:${this.RMQ_PASSWORD}@${this.ADDRESS}/smartranking`,
      ],
      queue: 'rankings',
    },
  });

  private clientNotifications = ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${this.RMQ_USER}:${this.RMQ_PASSWORD}@${this.ADDRESS}/smartranking`,
      ],
      queue: 'notifications',
    },
  });

  public get getClientChallenges() {
    return this.clientChallenges;
  }

  public get getClientRankings() {
    return this.clientRankings;
  }

  public get getClientNotifications() {
    return this.clientNotifications;
  }
}
