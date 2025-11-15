import { Injectable } from '@nestjs/common';
import { Categories } from '../infra/category.entity';
import { UpdateCategoryBudgetDto } from '../dto/update-category-budget.dto';
import { Budget } from '../../budget/infra/budget.entity';
import { InvalidBudgetRangeError } from 'src/common/exceptions/custom-exceptions';
import { BudgetPeriodModel, CategorySnapshot } from '../types/category-domain-type';

@Injectable()
export class CategoryDomainService {

  buildBudgetPeriod(budget: Budget, spent: number): BudgetPeriodModel {
    const amount = Number(budget.amount)
    return {
      id: budget.id,
      amount,
      startDate: budget.startDate,
      endDate: budget.endDate,
      spent,
      remaining: amount - spent,
    }
  }

  determineCurrentBudget(budgets: BudgetPeriodModel[], now: Date = new Date()): BudgetPeriodModel | null {
    const current = budgets.find((budget) => {
      const start = new Date(budget.startDate)
      const end = new Date(budget.endDate)
      return now >= start && now <= end
    })
    if (current) {
      return current
    }
    return budgets.length > 0 ? budgets[0] : null
  }

  mapCategory(category: Categories): CategorySnapshot {
    return {
      id: category.id,
      name: category.name,
    }
  }

}
