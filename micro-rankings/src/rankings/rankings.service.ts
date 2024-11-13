import { Injectable, Logger } from '@nestjs/common';
import { ProcessMatchPayload } from './interfaces/process-match.payload';
import { InjectModel } from '@nestjs/mongoose';
import { get, Model } from 'mongoose';
import { Ranking } from './interfaces/ranking.schema';
import { RpcException } from '@nestjs/microservices';
import { Proxyrmq } from 'src/proxyrmq/proxyrmq';
import { Category } from './interfaces/category.interface';
import { EventName } from './enums/event-name.enum';
import { GetRankingsPayload } from './interfaces/get-rankings.payload';
import * as moment from 'moment-timezone';
import { Challenge } from './interfaces/challenge.interface';
import * as _ from 'lodash';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel('Ranking') private readonly rankingModel: Model<Ranking>,
  ) {}
  private logger = new Logger(RankingsService.name);
  private proxyRmq = new Proxyrmq();
  private clientAdminBackend = this.proxyRmq.getClientAdminBackend;
  private clientChallenges = this.proxyRmq.getClientChallenges;

  async processMatch({ matchId, match }: ProcessMatchPayload) {
    try {
      const category: Category = await this.clientAdminBackend
        .send('find-categories', match.category)
        .toPromise();

      await Promise.all(
        match.players.map(async (player) => {
          const ranking = new this.rankingModel();

          ranking.challenge = match.challenge;
          ranking.player = player;
          ranking.match = matchId;
          ranking.category = match.category;

          if (player == match.def) {
            const filterEvent = category.events.filter(
              (event) => event.name == EventName.WIN,
            );

            ranking.event = EventName.WIN;
            ranking.operation = filterEvent[0].operation;
            ranking.points = filterEvent[0].value;
          } else {
            const filterEvent = category.events.filter(
              (event) => event.name == EventName.LOSE,
            );

            ranking.event = EventName.LOSE;
            ranking.operation = filterEvent[0].operation;
            ranking.points = filterEvent[0].value;
          }

          this.logger.log(`ranking: ${JSON.stringify(ranking)}`);

          await ranking.save();
        }),
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }

  async getRankings(getRankingsPayload: GetRankingsPayload) {
    try {
      if (!getRankingsPayload.refDate) {
        getRankingsPayload.refDate = moment()
          .tz('America/Sao_Paulo')
          .format('YYYY-MM-DD');
      }

      const { categoryId, refDate } = getRankingsPayload;

      const rankingRecord = await this.rankingModel
        .find()
        .where('category')
        .equals(categoryId)
        .exec();

      const challenges: Challenge[] = await this.clientChallenges
        .send('get-completed-challenges', {
          categoryId: categoryId,
          refDate: refDate,
        })
        .toPromise();

      _.remove(rankingRecord, function (item) {
        return (
          challenges.filter((challenge) => challenge._id == item.challenge)
            .length == 0
        );
      });

      this.logger.log(`record: ${JSON.stringify(rankingRecord)}`);

      return rankingRecord;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }
}
