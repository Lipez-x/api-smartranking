import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchSchema } from 'src/match/interfaces/match.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Matches', schema: MatchSchema }]),
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
