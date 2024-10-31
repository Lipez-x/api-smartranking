import { Controller, Logger } from '@nestjs/common';
import { Player } from './interfaces/player.interface';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PlayerService } from './player.service';

const ackErrors: string[] = ['E11000', 'Cast to ObjectId'];

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  private logger = new Logger(PlayerController.name);

  @EventPattern('create-player')
  async createPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`Player: ${JSON.stringify(player)}`);

    try {
      await this.playerService.createPlayer(player);
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
