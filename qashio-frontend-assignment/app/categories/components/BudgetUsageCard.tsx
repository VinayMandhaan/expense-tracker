import { Chip, LinearProgress, Paper, Stack, Typography, type ChipProps } from '@mui/material'
import { formatCurrency } from '@/lib/utils'
import { CategorySummary } from '../types'

interface BudgetUsageCardProps {
  currentBudget: CategorySummary['currentBudget']
}

export default function BudgetUsageCard({ currentBudget }: BudgetUsageCardProps) {
  if (!currentBudget) return null

  const progress = currentBudget.amount > 0 ? Math.min(100, (currentBudget.spent / currentBudget.amount) * 100) : 0
  const statusLabel = currentBudget.remaining >= 0 ? 'On Track' : 'Exceeded'
  const chipColor: ChipProps['color'] = currentBudget.remaining >= 0 ? 'success' : 'error'

  return (
    <Paper variant="outlined" sx={{ borderRadius: 4, borderColor: '#ececec', p: 3 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600}>Budget usage</Typography>
          <Chip label={statusLabel} color={chipColor} size="small" />
        </Stack>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 999 }} />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Spent {formatCurrency(currentBudget.spent)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Remaining {formatCurrency(currentBudget.remaining)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}
