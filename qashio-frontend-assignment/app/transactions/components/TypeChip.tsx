'use client';

import { Chip } from '@mui/material';
import { Transaction } from '../types';

export function TypeChip({ type }: { type: Transaction['type'] }) {
  const isIncome = type === 'income'
  return (
    <Chip
      label={isIncome ? 'Income' : 'Expense'}
      size="small"
      sx={{
        textTransform: 'capitalize',
        fontWeight: 600,
        borderRadius: 999,
        px: 0.5,
        bgcolor: isIncome ? 'rgba(65, 189, 141, 0.15)' : 'rgba(239, 83, 80, 0.15)',
        color: isIncome ? '#1c8c62' : '#c62828',
      }}
    />
  )
}
