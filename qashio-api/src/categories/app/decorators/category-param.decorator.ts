import { Param } from '@nestjs/common';
import { CategoryByIdPipe } from '../pipes/category-by-id.pipe';

export const CategoryParam = (paramKey: string = 'id') => {
  return Param(paramKey, CategoryByIdPipe)
}
 
