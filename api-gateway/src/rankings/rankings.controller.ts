import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyProvider } from 'src/client-proxy/client-proxy';

@Controller('api/v1/rankings')
export class RankingsController {
  private proxyRmq = new ClientProxyProvider();
  private clientRankings = this.proxyRmq.getClientRankings;

  @Get()
  getRankings(
    @Query('categoryId') categoryId: string,
    @Query('refDate') refDate: string,
  ): Observable<any> {
    if (!categoryId) {
      throw new BadRequestException('Category ID is required');
    }

    return this.clientRankings.send('get-rankings', {
      categoryId: categoryId,
      refDate: refDate ? refDate : '',
    });
  }
}
