import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { catchError } from 'rxjs';
import { ClientProxyProvider } from 'src/client-proxy/client-proxy';

export class CategoryValidationPipe implements PipeTransform {
  private clientProxy = new ClientProxyProvider();
  private clientAdminBackend = this.clientProxy.getClientAdminBackEnd;
  async transform(value: any, metadata: ArgumentMetadata) {
    await this.clientAdminBackend
      .send('find-categories', value.categoryId)
      .pipe(
        catchError((error) => {
          throw new BadRequestException('This category is not valid');
        }),
      )
      .toPromise();

    return value;
  }
}
