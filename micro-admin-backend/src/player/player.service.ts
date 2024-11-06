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
import { CreatePlayerPayload } from './interfaces/create-player.payload';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
    private readonly categoryService: CategoryService,
  ) {}

  private logger = new Logger(PlayerService.name);

  async createPlayer(createPlayerPayload: CreatePlayerPayload) {
    const { categoryId, phoneNumber, email, name } = createPlayerPayload;

    const category = await this.categoryService.findCategoryById(categoryId);

    try {
      const createPlayer = new this.playerModel({
        phoneNumber,
        email,
        name,
      });

      await createPlayer.save();

      category.players.push(createPlayer);
      await this.categoryService.updateCategory(categoryId, category);
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

  async updatePlayer(updatePlayerPayload: UpdatePlayerPayload) {
    const { id, updatePlayerDto } = updatePlayerPayload;

    const categoryExists = await this.categoryService.findCategoryById(
      updatePlayerDto.categoryId,
    );

    const player = await this.playerModel.findById(id);

    if (!player) {
      throw new RpcException('Player not found');
    }

    try {
      await this.playerModel
        .findByIdAndUpdate(id, { $set: updatePlayerDto })
        .exec();

      const categoryPlayer = await this.categoryService.findPlayerCategory(id);

      console.log(categoryPlayer.category);

      if (!categoryPlayer) {
        categoryExists.players.push(player);
        await this.categoryService.updateCategory(
          updatePlayerDto.categoryId,
          categoryExists,
        );
      } else if (categoryPlayer.category !== categoryExists.category) {
        const playerIndex = categoryPlayer.players.findIndex(
          (p) => p == player.id,
        );

        if (playerIndex !== -1) {
          categoryPlayer.players.splice(playerIndex, 1);
          console.log('Tá funcionando isso');
        }

        categoryExists.players.push(player);

        await this.categoryService.updateCategory(
          categoryPlayer.category,
          categoryPlayer,
        );

        await this.categoryService.updateCategory(
          updatePlayerDto.categoryId,
          categoryExists,
        );
      }
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
