import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { CategoryValidationPipe } from 'src/common/pipes/category-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlayerService } from './player.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createPlayer(@Body(CategoryValidationPipe) createPlayerDto: CreatePlayerDto) {
    this.playerService.createPlayer(createPlayerDto);
  }

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file, @Param('id') id: string) {
    return await this.playerService.uploadImage(file, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getPlayers(@Query('id') id: string): Promise<any> {
    return this.playerService.getPlayers(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updatePlayer(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body(CategoryValidationPipe) updatePlayerDto: UpdatePlayerDto,
  ) {
    this.playerService.updatePlayer(id, updatePlayerDto);
  }

  @Delete('/:id')
  deletePlayer(@Param('id', ObjectIdValidationPipe) id: string) {
    this.playerService.deletePlayer(id);
  }
}
