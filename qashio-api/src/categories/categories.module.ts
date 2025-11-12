import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from './categories.entity';
import { CategoriesController } from './categories.controller';
import { Transactions } from 'src/transactions/transactions.entity';
import { Budget } from 'src/budget/budget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categories, Transactions, Budget])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule { }
