import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { isString } from 'class-validator';

export class CategoryIdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isString(value)) {
      throw new BadRequestException('This category is not valid');
    }

    return value;
  }
}
