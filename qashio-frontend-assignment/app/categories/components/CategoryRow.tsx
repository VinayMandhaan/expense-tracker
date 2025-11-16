'use client';

import { TableRow, TableCell, Stack, Typography, LinearProgress, Chip } from '@mui/material';
import { formatCurrency } from '@/lib/utils';
import { CategorySummary } from '../types';

interface CategoryRowProps {
  summary: CategorySummary
  onSelect: (categoryId: string) => void
}

export default function CategoryRow({ summary, onSelect }: CategoryRowProps) {
  const currentBudget = summary.currentBudget
  const progress = currentBudget && currentBudget.amount > 0 ? Math.min(100, (currentBudget.spent / currentBudget.amount) * 100) : 0
  const statusLabel = currentBudget ? currentBudget.remaining >= 0 ? 'On Track' : 'Exceeded' : 'No Budget'
  const statusColor: 'default' | 'success' | 'error' = currentBudget ? currentBudget.remaining >= 0 ? 'success' : 'error' : 'default'

  return (
    <TableRow hover onClick={() => onSelect(summary.category.id)} sx={{ cursor: 'pointer' }}>
      <TableCell sx={{ fontWeight: 600 }}>{summary.category.name}</TableCell>
      <TableCell>
        {currentBudget ? (
          <Stack spacing={1}>
            <Typography fontWeight={600}>{formatCurrency(currentBudget.amount)}</Typography>
            <Typography variant="caption" color="text.secondary">
              {currentBudget.startDate} – {currentBudget.endDate}
            </Typography>
          </Stack>
        ) : (
          <Typography color="text.secondary">No active budget</Typography>
        )}
      </TableCell>
      <TableCell>{formatCurrency(summary.totalSpent)}</TableCell>
      <TableCell>{currentBudget ? formatCurrency(currentBudget.remaining) : '—'}</TableCell>
      <TableCell>
        {currentBudget && (
          <Stack spacing={1}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 999 }} />
            <Typography variant="caption" color="text.secondary">
              {progress.toFixed(0)}% used
            </Typography>
          </Stack>
        )}
      </TableCell>
      <TableCell>
        <Chip label={statusLabel} color={statusColor} size="small" />
      </TableCell>
    </TableRow>
  )
}
