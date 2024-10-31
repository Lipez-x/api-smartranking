import { Module } from '@nestjs/common';
import { ClientProxyProvider } from './client-proxy';

@Module({
  providers: [ClientProxyProvider],
})
export class ClientProxyModule {}
