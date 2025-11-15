import { Injectable } from '@nestjs/common';
import { Budget } from '../infra/budget.entity';

export interface BudgetViewModel {
  id: string;
  amount: number;
  startDate: string;
  endDate: string;
  spent: number;
  remaining: number;
}

@Injectable()
export class BudgetDomainService {
  buildBudgetView(budget: Budget, spent: number): BudgetViewModel {
    const amount = Number(budget.amount)
    return {
      id: budget.id,
      amount,
      startDate: budget.startDate,
      endDate: budget.endDate,
      spent,
      remaining: amount - spent,
    };
  }
}
