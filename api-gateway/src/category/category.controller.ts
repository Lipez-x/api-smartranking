import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppController } from 'src/app.controller';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { ClientProxyProvider } from 'src/client-proxy/client-proxy';

@Controller('api/v1/categories')
export class CategoryController {
  private logger = new Logger(AppController.name);

  private clientProxy = new ClientProxyProvider();
  private clientAdminBackend = this.clientProxy.getClientAdminBackEnd;

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  @Get()
  findCategories(@Query('id') id: string): Observable<any> {
    return this.clientAdminBackend.send('find-categories', id ? id : '');
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateCategories(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    this.clientAdminBackend.emit('update-categories', {
      id,
      updateCategoryDto,
    });
  }
}
