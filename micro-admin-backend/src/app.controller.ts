import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Category } from './interfaces/categories/category.interface';
import { updateCategoryPayload } from './interfaces/update-category-payload';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(@Payload() category: Category) {
    this.logger.log(`Category: ${JSON.stringify(category)}`);
    await this.appService.createCategory(category);
  }

  @MessagePattern('find-categories')
  async findCategories(@Payload() id: string) {
    if (id) {
      return await this.appService.findCategoryById(id);
    } else {
      return await this.appService.findAllCategories();
    }
  }

  @EventPattern('update-categories')
  async updateCategories(
    @Payload() { id, updateCategoryDto }: updateCategoryPayload,
  ) {
    this.logger.log(`Update category ${id} with ${updateCategoryDto}`);
    await this.appService.updateCategory(id, updateCategoryDto);
  }
}
