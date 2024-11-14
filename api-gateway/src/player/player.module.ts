import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { AwsModule } from 'src/aws/aws.module';
import { PlayerService } from './player.service';

@Module({
  imports: [AwsModule],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
