import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './app/transactions.controller';
import { TransactionsAppService } from './app/transactions.service';
import { Transactions } from './infra/transaction.entity';
import { TransactionRepository } from './infra/transaction.repository';
import { KafkaPublisher } from './infra/kafka.publisher';
import { TransactionByIdPipe } from './app/pipes/transaction-by-id.pipe';
import { TransactionsDomainService } from './domain/transactions.domain-service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CategoriesModule } from '../categories/categories.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions]), CategoriesModule, KafkaModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsAppService,
    TransactionRepository,
    KafkaPublisher,
    TransactionByIdPipe,
    TransactionsDomainService,
    ApiKeyGuard,
  ],
  exports: [TransactionsAppService],
})
export class TransactionsModule {}
