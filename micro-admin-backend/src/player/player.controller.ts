import { Body, Controller, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PlayerService } from './player.service';

const ackErrors: string[] = ['E11000', 'Cast to ObjectId'];

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  private logger = new Logger(PlayerController.name);

  @EventPattern('create-player')
  async createPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
    console.log(player);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`Player: ${JSON.stringify(player)}`);

    try {
      await this.playerService.createPlayer(player);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(error.message);
      ackErrors.map(async (ackError) => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMsg);
        }
      });
    }
  }
}
