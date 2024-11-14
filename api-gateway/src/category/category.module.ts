import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
