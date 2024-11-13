import { Injectable, Logger } from '@nestjs/common';
import { ProcessMatchPayload } from './interfaces/process-match.payload';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ranking } from './interfaces/ranking.schema';
import { RpcException } from '@nestjs/microservices';
import { Proxyrmq } from 'src/proxyrmq/proxyrmq';
import { Category } from './interfaces/category.interface';
import { EventName } from './enums/event-name.enum';
import { GetRankingsPayload } from './interfaces/get-rankings.payload';
import * as moment from 'moment-timezone';
import { Challenge } from './interfaces/challenge.interface';
import * as _ from 'lodash';
import {
  History,
  RankingResponse,
} from './interfaces/ranking-response.interface';

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

      const result = _(rankingRecord)
        .groupBy('player')
        .map((items, key) => ({
          player: key,
          history: _.countBy(items, 'event'),
          points: _.sumBy(items, 'points'),
        }))
        .value();

      this.logger.log(`Result: ${JSON.stringify(result)}`);

      const orderResult = _.orderBy(result, 'points', 'desc');

      const ranking: RankingResponse[] = [];

      orderResult.map(function (item, index) {
        const rankingResponse: RankingResponse = {};

        rankingResponse.player = item.player;
        rankingResponse.position = index + 1;
        rankingResponse.score = item.points;

        const history: History = {};

        history.victories = item.history.WIN ? item.history.WIN : 0;
        history.defeats = item.history.LOSE ? item.history.LOSE : 0;
        rankingResponse.matchHistory = history;

        ranking.push(rankingResponse);
      });

      return ranking;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }
}
