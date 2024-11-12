import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ProcessMatchPayload } from './interfaces/process-match.payload';
import { RankingsService } from './rankings.service';
import { GetRankingsPayload } from './interfaces/get-rankings.payload';

const ackErrors: string[] = ['E11000', 'Cast to ObjectId'];

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingService: RankingsService) {}

  private logger = new Logger(RankingsController.name);

  @EventPattern('process-match')
  async processMatch(
    @Payload() processMatchPayload: ProcessMatchPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.rankingService.processMatch(processMatchPayload);
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

  @MessagePattern('get-rankings')
  async getRankings(
    @Payload() getRankingsPayload: GetRankingsPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return await this.rankingService.getRankings(getRankingsPayload);
    } finally {
      await channel.ack(originalMsg);
    }
  }
}
