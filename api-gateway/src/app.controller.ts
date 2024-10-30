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
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Observable } from 'rxjs';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryIdValidationPipe } from './pipes/category-id-validation.pipe';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  RMQ_USER = process.env.RMQ_USER;
  RMQ_PASSWORD = process.env.RMQ_PASSWORD;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${this.RMQ_USER}:${this.RMQ_PASSWORD}@3.15.222.109:5672/smartranking`,
        ],
        queue: 'admin-backend',
      },
    });
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  @Get('categories')
  findCategories(@Query('id') id: string): Observable<any> {
    return this.clientAdminBackend.send('find-categories', id ? id : '');
  }

  @Put('categories/:id')
  @UsePipes(ValidationPipe)
  updateCategories(
    @Param('id', CategoryIdValidationPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Observable<any> {
    return this.clientAdminBackend.emit('update-categories', {
      id,
      updateCategoryDto,
    });
  }
}
