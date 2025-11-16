import { Stack } from '@mui/material'
import { CustomCard } from '@/app/components/CustomCard'
import { formatCurrency } from '@/lib/utils'
import { CategorySummary } from '../types'

interface CategoryStatsProps {
  totalSpent: number
  currentBudget: CategorySummary['currentBudget']
}

export default function CategoryStats({ totalSpent, currentBudget }: CategoryStatsProps) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      <CustomCard label="Total Spent" value={formatCurrency(totalSpent)} />
      <CustomCard
        label="Current Budget"
        value={currentBudget ? formatCurrency(currentBudget.amount) : 'No active budget'}
        subtTitle={currentBudget ? `${currentBudget.startDate} – ${currentBudget.endDate}` : undefined}
      />
      <CustomCard
        label="Remaining"
        value={formatCurrency(currentBudget ? currentBudget.remaining : 0)}
      />
    </Stack>
  )
}
