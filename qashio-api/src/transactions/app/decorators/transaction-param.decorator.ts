import { Param, ParseUUIDPipe } from '@nestjs/common';
import { TransactionByIdPipe } from '../pipes/transaction-by-id.pipe';

export const TransactionParam = (paramKey: string = 'id') => {
  return Param(paramKey, new ParseUUIDPipe(), TransactionByIdPipe)
}
