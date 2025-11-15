import { Injectable, PipeTransform } from '@nestjs/common';
import { Categories } from '../../infra/category.entity';
import { CategoryRepository } from '../../infra/category.repository';

@Injectable()
export class CategoryByIdPipe
  implements PipeTransform<string, Promise<Categories>>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  transform(value: string): Promise<Categories> {
    return this.categoryRepository.findById(value)
  }
}
