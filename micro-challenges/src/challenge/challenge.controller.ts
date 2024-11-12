import { Controller, Logger } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Challenge } from './interfaces/challenge.interface';
import { UpdateChallengePayload } from './interfaces/update-challenge.payload';
import { AssignChallengeMatchPayload } from './interfaces/assign-challenge-match.payload';
import { GetCompletedChallengePayload } from './interfaces/get-completed-challenge.payload';
const ackErrors: string[] = ['E11000', 'Cast to ObjectId'];

@Controller('challenge')
export class ChallengeController {
  private logger = new Logger(ChallengeController.name);

  constructor(private readonly challengeService: ChallengeService) {}

  @EventPattern('create-challenge')
  async createChallenge(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.challengeService.createChallenge(challenge);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(error.message);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('assign-challenge-match')
  async assignMatchToChallenge(
    @Payload() assignMatchChallengePayload: AssignChallengeMatchPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.challengeService.assignMatchToChallenge(
        assignMatchChallengePayload,
      );
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(error.message);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('get-challenges')
  async getChallenges(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      if (id) {
        return await this.challengeService.findChallengeById(id);
      } else {
        return await this.challengeService.findAllChallenges();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('get-player-challenges')
  async findPlayerChallenges(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return await this.challengeService.findPlayerChallenges(id);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('get-completed-challenges')
  async getCompletedChallenge(
    @Payload() getCompletedChallengePayload: GetCompletedChallengePayload,
    @Ctx() context: RmqContext,
  ): Promise<Challenge[] | Challenge> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const { categoryId, refDate } = getCompletedChallengePayload;
      this.logger.log(`data: ${JSON.stringify(getCompletedChallengePayload)}`);
      if (refDate) {
        return await this.challengeService.findCompletedChallengesByDate(
          categoryId,
          refDate,
        );
      } else {
        return await this.challengeService.findCompletedChallenges(categoryId);
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-challenge')
  async updateChallenge(
    @Payload() updateChallengePayload: UpdateChallengePayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.challengeService.updateChallenge(updateChallengePayload);
    } catch (error) {
      this.logger.error(error.message);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('delete-challenge')
  async deleteChallenge(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.challengeService.deleteChallenge(id);
    } catch (error) {
      this.logger.error(error.message);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }
}
