import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChallengeModule } from './challenge/challenge.module';
import { MatchModule } from './match/match.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ryepw.mongodb.net/srchallenges?retryWrites=true&w=majority&appName=Cluster0`,
    ),
    ChallengeModule,
    MatchModule,
    ProxyrmqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
