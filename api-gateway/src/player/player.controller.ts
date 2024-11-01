import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxyProvider } from 'src/client-proxy/client-proxy';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { CategoryController } from 'src/category/category.controller';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Observable } from 'rxjs';

@Controller('api/v1/players')
export class PlayerController {
  private logger = new Logger(PlayerController.name);

  private clientProxy = new ClientProxyProvider();
  private clientAdminBackend = this.clientProxy.getClientAdminBackEnd;

  @Post()
  @UsePipes(ValidationPipe)
  createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    this.clientAdminBackend.emit('create-player', createPlayerDto);
  }

  @Get()
  getPlayers(@Query('id') id: string): Observable<any> {
    return this.clientAdminBackend.send('get-players', id ? id : '');
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updatePlayer(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    this.clientAdminBackend.emit('update-player', { id, updatePlayerDto });
  }

  @Delete('/:id')
  deletePlayer(@Param('id', ObjectIdValidationPipe) id: string) {
    this.clientAdminBackend.emit('delete-player', id);
  }
}
