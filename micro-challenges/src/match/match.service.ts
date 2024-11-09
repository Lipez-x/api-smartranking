import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './interfaces/match.model';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel('Matches') private readonly matchModel: Model<Match>,
  ) {}
}
