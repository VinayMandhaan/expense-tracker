import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './transactions.entity';
import { Categories } from 'src/categories/categories.entity';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
    imports: [TypeOrmModule.forFeature([Transactions, Categories]), KafkaModule],
    controllers: [TransactionsController],
    providers: [TransactionsService],
    exports: [TransactionsService],
})
export class TransactionsModule { }
