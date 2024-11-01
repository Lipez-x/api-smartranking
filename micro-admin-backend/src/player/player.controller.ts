import { Controller, Get, Logger } from '@nestjs/common';
import { Player } from './interfaces/player.interface';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PlayerService } from './player.service';
import { UpdatePlayerPayload } from './interfaces/update-player.payload';
import { CreatePlayerPayload } from './interfaces/create-player.payload';

const ackErrors: string[] = ['E11000', 'Cast to ObjectId'];

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  private logger = new Logger(PlayerController.name);

  @EventPattern('create-player')
  async createPlayer(
    @Payload() createPlayerPayload: CreatePlayerPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`Player: ${JSON.stringify(createPlayerPayload)}`);

    try {
      await this.playerService.createPlayer(createPlayerPayload);
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

  @MessagePattern('get-players')
  async findPlayers(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      if (id) {
        return await this.playerService.findPlayerById(id);
      } else {
        return await this.playerService.findAllPlayers();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-player')
  async updatePlayer(
    @Payload() updatePlayerPayload: UpdatePlayerPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.playerService.updatePlayer(updatePlayerPayload);
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

  @EventPattern('delete-player')
  async deletePlayer(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.playerService.deletePlayer(id);
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
