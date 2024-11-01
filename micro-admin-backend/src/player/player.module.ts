import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from './interfaces/player.schema';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }]),
    CategoryModule,
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
