import { Module } from '@nestjs/common';
import { Proxyrmq } from './proxyrmq';

@Module({
  providers: [Proxyrmq]
})
export class ProxyrmqModule {}
