import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BudgetModule } from './budget/budget.module';

@Module({
  imports: [CategoriesModule, TransactionsModule, BudgetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
