import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './infra/budget.entity';
import { BudgetAppService } from './app/budget.service';
import { BudgetController } from './app/budget.controller';
import { BudgetRepository } from './infra/budget.repository';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { BudgetUsageService } from './infra/budget-usage.service';
import { Transactions } from '../transactions/infra/transaction.entity';
import { BudgetDomainService } from './domain/budget.domain-service';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, Transactions])],
  controllers: [BudgetController],
  providers: [
    BudgetAppService,
    BudgetRepository,
    BudgetUsageService,
    BudgetDomainService,
    ApiKeyGuard,
  ],
  exports: [BudgetAppService, BudgetRepository, BudgetUsageService],
})
export class BudgetModule {}
