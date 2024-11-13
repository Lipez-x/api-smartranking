import { Body, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from './interfaces/challenge.interface';
import { RpcException } from '@nestjs/microservices';
import { UpdateChallengePayload } from './interfaces/update-challenge.payload';
import { ChallengeStatus } from './enums/challenge-status.enum';
import { AssignChallengeMatchPayload } from './interfaces/assign-challenge-match.payload';
import * as moment from 'moment-timezone';

@Injectable()
export class ChallengeService {
  private logger = new Logger(ChallengeService.name);

  constructor(
    @InjectModel('Challenges')
    private readonly challengeModel: Model<Challenge>,
  ) {}

  async createChallenge(challenge: Challenge) {
    try {
      const createdChallenge = new this.challengeModel(challenge);
      createdChallenge.status = ChallengeStatus.PENDING;
      await createdChallenge.save();
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async assignMatchToChallenge({
    matchId,
    challengeId,
  }: AssignChallengeMatchPayload) {
    try {
      const challenge = await this.findChallengeById(challengeId);

      challenge.match.push(matchId);
      await this.challengeModel.findByIdAndUpdate(challengeId, challenge);
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async findAllChallenges() {
    try {
      const challenges = await this.challengeModel.find().exec();
      console.log(challenges);

      return challenges;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async findPlayerChallenges(id: any) {
    try {
      const playerChallenges = await this.challengeModel
        .find()
        .where('players')
        .in(id)
        .exec();

      return playerChallenges;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async findChallengeById(id: string) {
    try {
      const challenge = await this.challengeModel.findById(id);

      return challenge;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async findCompletedChallenges(categoryId: string): Promise<Challenge[]> {
    try {
      return await this.challengeModel
        .find()
        .where('category')
        .equals(categoryId)
        .where('status')
        .equals(ChallengeStatus.COMPLETED)
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findCompletedChallengesByDate(
    categoryId: string,
    refDate: string,
  ): Promise<Challenge[]> {
    try {
      const formattedDate = moment(refDate).toDate();

      return await this.challengeModel
        .find()
        .where('category')
        .equals(categoryId)
        .where('status')
        .equals(ChallengeStatus.ACCEPTED)
        .lte('dateTimeChallenge', formattedDate)
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updateChallenge({ id, updateChallengeDto }: UpdateChallengePayload) {
    try {
      await this.challengeModel.findByIdAndUpdate(id, updateChallengeDto);
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async deleteChallenge(id: string) {
    try {
      await this.challengeModel.findByIdAndDelete(id);
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }
}
