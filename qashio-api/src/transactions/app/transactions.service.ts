import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { QueryTransactionDto } from '../dto/query-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionRepository } from '../infra/transaction.repository';
import { CategoryRepository } from '../../categories/infra/category.repository';
import {
  KafkaPublisher,
} from '../infra/kafka.publisher';
import { Transactions } from '../infra/transaction.entity';
import { TransactionsDomainService } from '../domain/transactions.domain-service';
import { EVT_TX_CREATED } from '../infra/kafka-events';

@Injectable()
export class TransactionsAppService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly kafkaPublisher: KafkaPublisher,
    private readonly domainService: TransactionsDomainService,
  ) { }

  async create(dto: CreateTransactionDto) {
    const category = await this.categoryRepository.findById(
      dto.categoryId,
    )
    const transaction = await this.transactionRepository.createTransaction(
      dto,
      category,
    )
    void this.kafkaPublisher.publish(EVT_TX_CREATED, {
      id: transaction.id,
    })
    return transaction
  }

  async getAll(q: QueryTransactionDto) {
    const { items, total, page, limit } = await this.transactionRepository.paginate(q)
    return {
      items,
      meta: {
        total,
        page,
        limit,
        pages: total > 0 ? Math.ceil(total / limit) : 0,
      },
    }
  }

  async update(transaction: Transactions, dto: UpdateTransactionDto) {
    if (dto.categoryId) {
      transaction.category = await this.categoryRepository.findById(dto.categoryId)
    }
    this.domainService.applyUpdates(transaction, dto)
    const saved = await this.transactionRepository.save(transaction)
    return this.transactionRepository.findById(saved.id)
  }

  async delete(transaction: Transactions) {
    await this.transactionRepository.remove(transaction)
    return { id: transaction.id }
  }
}
