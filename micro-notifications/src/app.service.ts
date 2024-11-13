import { Injectable, Logger } from '@nestjs/common';
import { Challenge } from './interfaces/challenge.interface';
import { Proxyrmq } from './proxyrmq/proxyrmq';
import { MailerService } from '@nestjs-modules/mailer';
import { RpcException } from '@nestjs/microservices';
import { Player } from './interfaces/player.interface';
import HTML_NOTIFICATION_CHALLENGE from 'static/html-notification-challenge';

@Injectable()
export class AppService {
  constructor(
    private clientProxy: Proxyrmq,
    private readonly mailService: MailerService,
  ) {}

  private clientAdminBackend = this.clientProxy.getClientAdminBackend;

  private logger = new Logger(AppService.name);

  async sendEmail(challenge: Challenge) {
    try {
      let receiverId = '';

      challenge.players.map((player) => {
        if (player != challenge.applicant) {
          receiverId = player;
        }
      });

      console.log(receiverId);

      const receiver: Player = await this.clientAdminBackend
        .send('get-players', receiverId)
        .toPromise();

      const sender: Player = await this.clientAdminBackend
        .send('get-players', challenge.applicant)
        .toPromise();

      let markup = '';

      markup = HTML_NOTIFICATION_CHALLENGE;
      markup = markup.replace(/#RECEIVER_NAME/g, receiver.name);
      markup = markup.replace(/#SENDER_NAME/g, sender.name);

      this.mailService
        .sendMail({
          to: receiver.email,
          from: 'SMART RANKING <ifelipelima.dev@gmail.com>',
          subject: 'Challenge notification',
          html: markup,
        })
        .then((sucess) => {
          this.logger.log(sucess);
        })
        .catch((err) => {
          this.logger.error(err);
        });
    } catch (error) {
      this.logger.error(`error: ${error.message}`);
      throw new RpcException(error.message);
    }
  }
}
