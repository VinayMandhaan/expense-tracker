import { Param } from '@nestjs/common';
import { BudgetByIdPipe } from 'src/categories/app/pipes/budget-by-id-pipe';

export const BudgetParam = (paramKey: string = 'id') => {
  return Param(paramKey, BudgetByIdPipe)
}
 
