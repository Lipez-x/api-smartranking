import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ClientProxyProvider } from 'src/client-proxy/client-proxy';
import { CreateChallengeDto } from './dtos/create-challenge.dto';

@Controller('api/v1/challenge')
export class ChallengeController {
  private clientProxyProvider = new ClientProxyProvider();
  private clientChallenges = this.clientProxyProvider.getClientChallenges;
  private clientAdminBackend = this.clientProxyProvider.getClientAdminBackEnd;

  @Post()
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    const { applicant, category, players } = createChallengeDto;
    const [playerOne, playerTwo] = players;

    const categoryExists = await this.clientAdminBackend
      .send('find-categories', category)
      .toPromise();

    if (!categoryExists) {
      throw new BadRequestException('This is not valid category');
    }

    const existsPlayerOne = await this.clientAdminBackend
      .send('get-players', playerOne.id)
      .toPromise();

    const existsPlayerTwo = await this.clientAdminBackend
      .send('get-players', playerTwo.id)
      .toPromise();

    if (!existsPlayerOne || !existsPlayerTwo) {
      throw new BadRequestException('Player not found');
    }

    if (existsPlayerOne.category !== category) {
      throw new BadRequestException('Player one is not part of this category');
    }

    if (existsPlayerTwo.category !== category) {
      throw new BadRequestException('Player two is not part of this category');
    }

    if (applicant.id !== playerOne.id && applicant.id !== playerTwo.id) {
      throw new BadRequestException(
        'The applicant needs to be part of the challenge',
      );
    }

    this.clientChallenges.emit('create-challenge', createChallengeDto);
  }
}
