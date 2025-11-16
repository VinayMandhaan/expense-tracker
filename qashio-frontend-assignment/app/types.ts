export type TransactionType = 'income' | 'expense'

export interface TransactionFilters {
  dateRange: {
    startDate: Date | null
    endDate: Date | null
  }
  searchTerm: string
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

