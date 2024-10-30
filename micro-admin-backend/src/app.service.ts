import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/categories/category.interface';
import { Player } from './interfaces/players/player.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(AppService.name);

  async createCategory(category: Category): Promise<Category> {
    try {
      const categoryCreated = new this.categoryModel(category);
      return categoryCreated.save();
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async findAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().populate('players').exec();
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async findCategoryById(category: string): Promise<Category> {
    const categoryExists = await this.categoryModel
      .findById({
        category: category,
      })
      .populate('players')
      .exec();

    if (!categoryExists) {
      throw new RpcException('Category not found');
    }
    try {
      return categoryExists;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async updateCategory(id: string, category: Category): Promise<void> {
    const categoryExists = await this.categoryModel.findById(id);

    if (!categoryExists) {
      throw new RpcException('Categroy is not found');
    }

    this.logger.log(categoryExists);

    try {
      await this.categoryModel
        .findOneAndUpdate({ category: id }, { $set: category })
        .exec();
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }
}
