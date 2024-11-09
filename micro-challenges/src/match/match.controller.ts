import { Controller, Logger } from '@nestjs/common';
import { MatchService } from './match.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Match } from './interfaces/match.model';
import { CreateMatchPayload } from './interfaces/create-match.payload';

const ackErrors: string[] = ['E11000', 'Cast to ObjectId'];

@Controller('match')
export class MatchController {
  private logger = new Logger(MatchController.name);

  constructor(private readonly matchService: MatchService) {}

  @EventPattern('create-match')
  async createMatch(
    @Payload() createMatchPayload: CreateMatchPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.matchService.createMatch(createMatchPayload);
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
}
