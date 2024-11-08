import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChallengeModule } from './challenge/challenge.module';
import { MatchModule } from './match/match.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [ChallengeModule, MatchModule, ProxyrmqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
