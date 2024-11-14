import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RankingsService } from './rankings.service';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  async getRankings(
    @Query('categoryId') categoryId: string,
    @Query('refDate') refDate: string,
  ): Promise<any> {
    return await this.rankingsService.getRankings(categoryId, refDate);
  }
}
