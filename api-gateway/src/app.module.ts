import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';
import { ClientProxyProvider } from './client-proxy/client-proxy';
import { ClientProxyModule } from './client-proxy/client-proxy.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoryModule,
    PlayerModule,
    ClientProxyModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [ClientProxyProvider],
})
export class AppModule {}
