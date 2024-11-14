import { BadRequestException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyProvider } from 'src/client-proxy/client-proxy';

@Injectable()
export class RankingsService {
  private proxyRmq = new ClientProxyProvider();
  private clientRankings = this.proxyRmq.getClientRankings;

  async getRankings(categoryId: string, refDate: string): Promise<any> {
    if (!categoryId) {
      throw new BadRequestException('Category ID is required');
    }

    return await this.clientRankings
      .send('get-rankings', {
        categoryId: categoryId,
        refDate: refDate ? refDate : '',
      })
      .toPromise();
  }
}
