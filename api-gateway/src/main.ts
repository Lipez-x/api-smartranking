import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/http-exception-filter';
import moment from 'moment-timezone';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());

  Date.prototype.toJSON = function (): any {
    return moment(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen(8080);
}

bootstrap();
