import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { AssignChallengeMatchDto } from './dtos/assign-challenge-match.dto';
import { ChallengeService } from './challenge.service';

@Controller('api/v1/challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    await this.challengeService.createChallenge(createChallengeDto);
  }

  @Post('/:id/match')
  @UsePipes(ValidationPipe)
  async assignMatchToChallenge(
    @Body() assignChallengeMatchDto: AssignChallengeMatchDto,
    @Param('id') id: string,
  ) {
    this.challengeService.assignMatchToChallenge(id, assignChallengeMatchDto);
  }

  @Get()
  async findChallenges(@Query('id') id: string) {
    return this.challengeService.findChallenges(id);
  }

  @Get('/player/:id')
  async findPlayerChallenges(@Param('id') id: string) {
    return this.challengeService.findPlayerChallenges(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updateChallenge(
    @Body() updateChallengeDto: UpdateChallengeDto,
    @Param('id') id: string,
  ) {
    await this.challengeService.updateChallenge(id, updateChallengeDto);
  }

  @Delete('/:id')
  async deleteChallenge(@Param('id') id: string) {
    await this.challengeService.deleteChallenge(id);
  }
}
