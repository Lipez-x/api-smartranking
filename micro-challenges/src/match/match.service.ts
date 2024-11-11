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
import { Proxyrmq } from 'src/proxyrmq/proxyrmq';

@Injectable()
export class MatchService {
  private logger = new Logger(MatchService.name);

  private clientProxy = new Proxyrmq();
  private clientChallenges = this.clientProxy.getClientChallenges;

  constructor(
    @InjectModel('Matches') private readonly matchModel: Model<Match>,
  ) {}

  async createMatch({ id, match }: CreateMatchPayload) {
    console.log(match);

    try {
      const createdMatch = new this.matchModel(match);
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
