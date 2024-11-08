import { Body, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from './interfaces/challenge.interface';
import { RpcException } from '@nestjs/microservices';
import { UpdateChallengePayload } from './interfaces/update-challenge.payload';

@Injectable()
export class ChallengeService {
  private logger = new Logger(ChallengeService.name);

  constructor(
    @InjectModel('Challenges')
    private readonly challengeModel: Model<Challenge>,
  ) {}

  private async createChallenge(@Body() challenge: Challenge) {
    try {
      const createdChallenge = new this.challengeModel(challenge);
      await createdChallenge.save();
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  private async findAllChallenges() {
    try {
      const challenges = await this.challengeModel
        .find()
        .populate('match')
        .exec();
      return challenges;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  private async findPlayerChallenges(id: any) {
    try {
      const playerChallenges = await this.challengeModel
        .find()
        .where('players')
        .in(id)
        .populate('match')
        .exec();

      return playerChallenges;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  private async findChallengeById(id: string) {
    try {
      const challenge = await this.challengeModel.findById(id);
      return challenge;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  private async updateChallenge({
    id,
    updateChallengeDto,
  }: UpdateChallengePayload) {
    try {
      await this.challengeModel.findByIdAndUpdate(id, updateChallengeDto);
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  private async deleteChallenge(id: string) {
    try {
      await this.challengeModel.findByIdAndDelete(id);
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }
}
