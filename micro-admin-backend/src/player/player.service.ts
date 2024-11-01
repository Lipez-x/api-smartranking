import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './interfaces/player.interface';
import {
  Ctx,
  EventPattern,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { UpdatePlayerPayload } from './interfaces/update-player.payload';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private logger = new Logger(PlayerService.name);

  async createPlayer(player: Player) {
    try {
      const createPlayer = new this.playerModel(player);
      await createPlayer.save();
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async findAllPlayers() {
    try {
      return await this.playerModel.find().exec();
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async findPlayerById(id: string) {
    const player = await this.playerModel.findById(id).exec();

    if (!player) {
      throw new RpcException('Player not found');
    }

    try {
      return player;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async updatePlayer({ id, updatePlayerDto }: UpdatePlayerPayload) {
    const player = await this.playerModel.findById(id);

    if (!player) {
      throw new RpcException('Player not found');
    }

    try {
      await this.playerModel
        .findByIdAndUpdate(id, { $set: updatePlayerDto })
        .exec();
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async deletePlayer(id: string) {
    const player = await this.playerModel.findById(id);

    if (!player) {
      throw new RpcException('Player not found');
    }

    try {
      await this.playerModel.findByIdAndDelete(id);
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }
}
