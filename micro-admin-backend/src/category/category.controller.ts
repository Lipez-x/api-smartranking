import { Controller, Logger } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  MessagePattern,
} from '@nestjs/microservices';
import { AppController } from 'src/app.controller';
import { updateCategoryPayload } from 'src/interfaces/update-category-payload';
import { Category } from './interfaces/category.interface';

const ackErrors: string[] = ['E11000', 'Cast to ObjectId'];

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`Category: ${JSON.stringify(category)}`);

    try {
      await this.categoryService.createCategory(category);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      ackErrors.map(async (ackError) => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMsg);
        }
      });
    }
  }

  @MessagePattern('find-categories')
  async findCategories(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      if (id) {
        return await this.categoryService.findCategoryById(id);
      } else {
        return await this.categoryService.findAllCategories();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-categories')
  async updateCategories(
    @Payload() { id, updateCategoryDto }: updateCategoryPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(
        `Update category ${id} with ${JSON.stringify(updateCategoryDto)}`,
      );
      await this.categoryService.updateCategory(id, updateCategoryDto);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(JSON.stringify(error.message));
      await channel.ack(originalMsg);
    }
  }
}
