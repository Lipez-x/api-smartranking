import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyProvider } from 'src/client-proxy/client-proxy';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class PlayerService {
  constructor(private awsService: AwsService) {}

  private clientProxy = new ClientProxyProvider();
  private clientAdminBackend = this.clientProxy.getClientAdminBackEnd;

  createPlayer(createPlayerDto: CreatePlayerDto) {
    this.clientAdminBackend.emit('create-player', createPlayerDto);
  }

  async uploadImage(file: any, id: string): Promise<any> {
    const player = await this.clientAdminBackend
      .send('get-players', id)
      .toPromise();

    if (!player) {
      throw new BadRequestException('Player not found');
    }

    const urlImagePlayer = await this.awsService.uploadFile(file, id);

    const updatePlayerDto: UpdatePlayerDto = {};
    updatePlayerDto.urlImagePlayer = urlImagePlayer.url;

    await this.clientAdminBackend.emit('update-player', {
      id,
      updatePlayerDto,
    });

    return await this.clientAdminBackend.send('get-players', id).toPromise();
  }

  async getPlayers(id: string): Promise<any> {
    return this.clientAdminBackend
      .send('get-players', id ? id : '')
      .toPromise();
  }

  updatePlayer(id: string, updatePlayerDto: UpdatePlayerDto) {
    this.clientAdminBackend.emit('update-player', { id, updatePlayerDto });
  }

  deletePlayer(id: string) {
    this.clientAdminBackend.emit('delete-player', id);
  }
}
