import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppService } from 'src/app.service';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Categories') private readonly categoryModel: Model<Category>,
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

  async findCategoryById(id: string): Promise<Category> {
    const categoryExists = await this.categoryModel
      .findById(id)
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
      throw new RpcException('Category is not found');
    }

    try {
      await this.categoryModel.findByIdAndUpdate(id, { $set: category }).exec();
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async findPlayerCategory(id: any) {
    try {
      const category = await this.categoryModel
        .findOne()
        .where('players')
        .in(id)
        .exec();

      return category;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }
}
