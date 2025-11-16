import { Box, Stack } from '@mui/material'
import { CategorySummary } from '../types'
import CategoryStats from './CategoryStats'
import BudgetUsageCard from './BudgetUsageCard'
import BudgetTimeline from './BudgetTimeline'

interface CategoryDetailContentProps {
  summary: CategorySummary
  deletingBudgetId: string | null
  budgetDeletionError: string | null
  onDeleteBudget: (budgetId: string) => void
}

export default function CategoryDetailContent({ summary, deletingBudgetId, budgetDeletionError, onDeleteBudget }: CategoryDetailContentProps) {
  return (
    <Box sx={{ p: 4, pt: 3 }}>
      <Stack spacing={3}>
        <CategoryStats totalSpent={summary.totalSpent} currentBudget={summary.currentBudget} />
        <BudgetUsageCard currentBudget={summary.currentBudget} />
        <BudgetTimeline
          budgets={summary.budgets}
          deletingBudgetId={deletingBudgetId}
          errorMessage={budgetDeletionError}
          onDelete={onDeleteBudget}
        />
      </Stack>
    </Box>
  )
}
