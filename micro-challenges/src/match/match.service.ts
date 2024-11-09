import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './interfaces/match.model';
import { AssignChallengeMatchPayload } from 'src/challenge/interfaces/assign-challenge-match.payload';
import {
  ClientProxyFactory,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { CreateMatchPayload } from './interfaces/create-match.payload';

@Injectable()
export class MatchService {
  private logger = new Logger(MatchService.name);

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

  constructor(
    @InjectModel('Matches') private readonly matchModel: Model<Match>,
  ) {}

  async createMatch({ id, assignChallengeMatchDto }: CreateMatchPayload) {
    try {
      const createdMatch = new this.matchModel(assignChallengeMatchDto);
      await createdMatch.save();

      const matchId = createdMatch.id;

      const challenge = await this.clientChallenges
        .send('get-challenges', id)
        .toPromise();

      return this.clientChallenges
        .emit('assign-challenge-match', {
          matchId,
          challengeId: challenge._id,
        })
        .toPromise();
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }
}
