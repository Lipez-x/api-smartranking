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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxyProvider } from 'src/client-proxy/client-proxy';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Observable } from 'rxjs';
import { CategoryValidationPipe } from 'src/common/pipes/category-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';

@Controller('api/v1/players')
export class PlayerController {
  private logger = new Logger(PlayerController.name);

  private clientProxy = new ClientProxyProvider();
  private clientAdminBackend = this.clientProxy.getClientAdminBackEnd;

  constructor(private awsService: AwsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body(CategoryValidationPipe) createPlayerDto: CreatePlayerDto,
  ) {
    this.clientAdminBackend.emit('create-player', createPlayerDto);
  }

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file, @Param('id') id: string) {
    const data = await this.awsService.uploadFile(file, id);
    return data;
  }

  @Get()
  getPlayers(@Query('id') id: string): Observable<any> {
    return this.clientAdminBackend.send('get-players', id ? id : '');
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updatePlayer(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body(CategoryValidationPipe) updatePlayerDto: UpdatePlayerDto,
  ) {
    this.clientAdminBackend.emit('update-player', { id, updatePlayerDto });
  }

  @Delete('/:id')
  deletePlayer(@Param('id', ObjectIdValidationPipe) id: string) {
    this.clientAdminBackend.emit('delete-player', id);
  }
}
