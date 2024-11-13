import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'email-smtp.us-east-2.amazonaws.com',
        port: 587,
        secure: false,
        tls: {
          ciphers: 'SSLv3',
        },
        auth: {
          user: 'AKIAZQ3DTWHIXTHFYQLC',
          pass: 'BNcQtskNTLuXAwSjvN+CpOmi/RWBWKv6EtEtDDGBy1Bj',
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProxyrmqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
