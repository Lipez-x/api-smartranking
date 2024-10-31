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
import { CreateCategoryDto } from './category/dtos/create-category.dto';
import { Observable } from 'rxjs';
import { UpdateCategoryDto } from './category/dtos/update-category.dto';
import { CategoryIdValidationPipe } from './common/pipes/category-id-validation.pipe';

@Controller('api/v1')
export class AppController {}
