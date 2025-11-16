'use client';

import { Stack, Typography } from '@mui/material';

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={1.5} py={6}>
      <Typography fontWeight={600}>{title}</Typography>
      {description && (
        <Typography color="text.secondary" variant="body2" textAlign="center">
          {description}
        </Typography>
      )}
      {action}
    </Stack>
  )
}
