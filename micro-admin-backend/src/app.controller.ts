import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Category } from './interfaces/categories/category.interface';
import { updateCategoryPayload } from './interfaces/update-category-payload';

const ackErrors: string[] = ['E11000', 'Cast to ObjectId'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
      await this.appService.createCategory(category);
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
        return await this.appService.findCategoryById(id);
      } else {
        return await this.appService.findAllCategories();
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
      await this.appService.updateCategory(id, updateCategoryDto);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(JSON.stringify(error.message));
      await channel.ack(originalMsg);
    }
  }
}
