import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxyProvider } from 'src/client-proxy/client-proxy';
import { AssignChallengeMatchDto } from './dtos/assign-challenge-match.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './enums/challenge-status.enum';
import { Match } from './interfaces/match.interface';

@Injectable()
export class ChallengeService {
  private clientProxyProvider = new ClientProxyProvider();
  private clientChallenges = this.clientProxyProvider.getClientChallenges;
  private clientAdminBackend = this.clientProxyProvider.getClientAdminBackEnd;

  async createChallenge(createChallengeDto: CreateChallengeDto) {
    const { applicant, category, players } = createChallengeDto;
    const [playerOne, playerTwo] = players;

    const categoryExists = await this.clientAdminBackend
      .send('find-categories', category)
      .toPromise();

    if (!categoryExists) {
      throw new BadRequestException('This is not valid category');
    }

    const existsPlayerOne = await this.clientAdminBackend
      .send('get-players', playerOne)
      .toPromise();

    const existsPlayerTwo = await this.clientAdminBackend
      .send('get-players', playerTwo)
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

    if (applicant !== playerOne && applicant !== playerTwo) {
      throw new BadRequestException(
        'The applicant needs to be part of the challenge',
      );
    }

    this.clientChallenges.emit('create-challenge', createChallengeDto);
  }

  async assignMatchToChallenge(
    id: string,
    assignChallengeMatchDto: AssignChallengeMatchDto,
  ) {
    const challenge = await this.clientChallenges
      .send('get-challenges', id)
      .toPromise();

    if (!challenge) {
      throw new NotFoundException('This challenge is not found');
    }

    if (challenge.status === ChallengeStatus.COMPLETED) {
      throw new BadRequestException(
        'This challenge has already been completed',
      );
    }

    if (challenge.status !== ChallengeStatus.ACCEPTED) {
      throw new BadRequestException('This challenge has not yet been accepted');
    }

    const [playerOne, playerTwo] = challenge.players;

    if (
      assignChallengeMatchDto.def !== playerOne &&
      assignChallengeMatchDto.def !== playerTwo
    ) {
      throw new BadRequestException(
        'The winning player is not part of the challenge',
      );
    }

    const match: Match = {
      category: challenge.category,
      challenge: id,
      players: challenge.players,
      def: assignChallengeMatchDto.def,
      result: assignChallengeMatchDto.result,
    };

    this.clientChallenges.emit('create-match', {
      id,
      match,
    });
  }

  async findChallenges(id: string) {
    return this.clientChallenges.send('get-challenges', id ? id : '');
  }

  async findPlayerChallenges(id: string) {
    const player = await this.clientAdminBackend
      .send('get-players', id)
      .toPromise();

    if (!player) {
      throw new NotFoundException('This player is not found');
    }

    return this.clientChallenges.send('get-player-challenges', id);
  }

  async updateChallenge(id: string, updateChallengeDto: UpdateChallengeDto) {
    const challenge = await this.clientChallenges
      .send('get-challenges', id)
      .toPromise();

    if (!challenge) {
      throw new NotFoundException('This challenge is not found');
    }

    if (challenge.status !== ChallengeStatus.PENDING) {
      throw new BadRequestException('This challenge is not pending');
    }

    this.clientChallenges.emit('update-challenge', { id, updateChallengeDto });
  }

  async deleteChallenge(id: string) {
    const challenge = await this.clientChallenges
      .send('get-challenges', id)
      .toPromise();

    if (!challenge) {
      throw new NotFoundException('This challenge is not found');
    }

    this.clientChallenges.emit('delete-challenge', id);
  }
}
