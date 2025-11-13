export type TransactionType = 'income' | 'expense'

export interface TransactionFilters {
  dateRange: {
    startDate: Date | null
    endDate: Date | null
  }
  searchTerm: string
}

export interface Category {
  id: string
  name: string
}

export interface Transaction {
  id: string
  amount: string
  date: string
  type: TransactionType
  category?: Category
  createdAt: string
  updatedAt: string
}

export interface Paginated<T> {
  items: T[]
  meta: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface BudgetPeriod {
  id: string
  amount: number
  startDate: string
  endDate: string
  spent: number
  remaining: number
}

export interface CategorySummary {
  category: Category
  totalSpent: number
  budgets: BudgetPeriod[]
  currentBudget: BudgetPeriod | null
}
