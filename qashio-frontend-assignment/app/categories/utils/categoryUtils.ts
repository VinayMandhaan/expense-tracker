import { CategoryStats, CategorySummary } from '../types'

export function getCategoryStats(summaries: CategorySummary[]): CategoryStats {
  const totalCategories = summaries.length
  const totalBudget = summaries.reduce((sum, summary) => sum + (summary.currentBudget?.amount ?? 0), 0)
  const totalRemaining = summaries.reduce((sum, summary) => sum + (summary.currentBudget?.remaining ?? 0), 0)

  return { totalCategories, totalBudget, totalRemaining }
}
