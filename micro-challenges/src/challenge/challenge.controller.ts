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

  @MessagePattern('get-challenges')
  async getChallenges(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      if (id) {
        return await this.challengeService.findPlayerChallenges(id);
      } else {
        return await this.challengeService.findAllChallenges();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('get-player-challenges')
  async findPlayerChallenges(@Payload() id, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return await this.challengeService.findPlayerChallenges(id);
    } finally {
      await channel.ack(originalMsg);
    }
  }
}
