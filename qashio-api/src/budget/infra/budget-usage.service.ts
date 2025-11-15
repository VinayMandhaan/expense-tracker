import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactions } from '../../transactions/infra/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BudgetUsageService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionRepo: Repository<Transactions>,
  ) {}

  calculateTotal(categoryId: string) {
    return this.calculateForRange(categoryId)
  }

  async calculateForRange(
    categoryId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const qb = this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COALESCE(SUM(transaction.amount), 0)', 'sum')
      .where('transaction."categoryId" = :categoryId', { categoryId })
      .andWhere('transaction.type = :type', { type: 'expense' })

    if (startDate && endDate) {
      qb.andWhere('transaction.date BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
    }

    const result = await qb.getRawOne<{ sum: string }>()
    return Number(result?.sum ? result?.sum : 0)
  }
}
