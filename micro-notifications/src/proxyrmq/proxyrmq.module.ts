import { Module } from '@nestjs/common';
import { Proxyrmq } from './proxyrmq';

@Module({
  providers: [Proxyrmq],
  exports: [Proxyrmq],
})
export class ProxyrmqModule {}
