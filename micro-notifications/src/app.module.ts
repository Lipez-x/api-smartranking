import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProxyrmqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
