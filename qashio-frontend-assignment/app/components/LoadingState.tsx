'use client';

import { CircularProgress, Stack, Typography } from '@mui/material';

interface LoadingStateProps {
  message?: string
}

export default function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={2} py={6}>
      <CircularProgress size={32} />
      <Typography color="text.secondary">{message}</Typography>
    </Stack>
  )
}
