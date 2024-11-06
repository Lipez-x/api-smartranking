import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [PlayerController],
})
export class PlayerModule {}
