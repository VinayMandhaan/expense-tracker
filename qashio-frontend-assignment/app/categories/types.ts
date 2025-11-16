
export interface CategorySummary {
    category: Category
    totalSpent: number
    budgets: BudgetPeriod[]
    currentBudget: BudgetPeriod | null
}

export interface BudgetPeriod {
    id: string
    amount: number
    startDate: string
    endDate: string
    spent: number
    remaining: number
}

export interface Category {
  id: string
  name: string
}

export interface CategoryStats {
  totalCategories: number
  totalBudget: number
  totalRemaining: number
}