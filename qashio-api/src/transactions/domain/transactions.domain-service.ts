import { Injectable } from '@nestjs/common';
import { Transactions } from '../infra/transaction.entity';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Injectable()
export class TransactionsDomainService {
  applyUpdates(transaction: Transactions,dto: UpdateTransactionDto): Transactions {
    if (dto.amount !== undefined) {
      transaction.amount = dto.amount
    }
    if (dto.date !== undefined) {
      transaction.date = dto.date
    }
    if (dto.type !== undefined) {
      transaction.type = dto.type
    }
    return transaction
  }
}
