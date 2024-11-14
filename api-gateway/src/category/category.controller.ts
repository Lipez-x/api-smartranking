import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryService } from './category.service';

@Controller('api/v1/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async findCategories(@Query('id') id: string) {
    return await this.categoryService.findCategories(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateCategories(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    this.categoryService.updateCategories(id, updateCategoryDto);
  }
}
