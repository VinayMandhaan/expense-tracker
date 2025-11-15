import { Expose, Type } from 'class-transformer';
import { BudgetView } from '../../budget/view/budget.view';

export class CategoryView {
  @Expose()
  id: string

  @Expose()
  name: string
}

export class CategorySummaryView {
  @Expose()
  @Type(() => CategoryView)
  category: CategoryView

  @Expose()
  totalSpent: number

  @Expose()
  @Type(() => BudgetView)
  budgets: BudgetView[]

  @Expose()
  @Type(() => BudgetView)
  currentBudget: BudgetView | null
}
