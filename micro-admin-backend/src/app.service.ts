import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category/interfaces/category.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {}
