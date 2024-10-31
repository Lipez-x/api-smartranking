import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';

@Module({
  controllers: [CategoryController],
})
export class CategoryModule {}
