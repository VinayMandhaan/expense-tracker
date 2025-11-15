import { Injectable, PipeTransform } from '@nestjs/common';
import { Transactions } from '../../infra/transaction.entity';
import { TransactionRepository } from '../../infra/transaction.repository';

@Injectable()
export class TransactionByIdPipe
  implements PipeTransform<string, Promise<Transactions>>
{
  constructor(private readonly transactionRepository: TransactionRepository) {}

  transform(value: string): Promise<Transactions> {
    return this.transactionRepository.findById(value)
  }
}
