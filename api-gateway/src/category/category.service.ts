import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyProvider } from 'src/client-proxy/client-proxy';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  private clientProxy = new ClientProxyProvider();
  private clientAdminBackend = this.clientProxy.getClientAdminBackEnd;

  createCategory(createCategoryDto: CreateCategoryDto) {
    this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  async findCategories(id: string): Promise<any> {
    return await this.clientAdminBackend
      .send('find-categories', id ? id : '')
      .toPromise();
  }

  updateCategories(id: string, updateCategoryDto: UpdateCategoryDto) {
    this.clientAdminBackend.emit('update-categories', {
      id,
      updateCategoryDto,
    });
  }
}
