'use client';

import { Alert, Stack, Typography } from '@mui/material';

interface ErrorStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
}

export default function ErrorState({
  title = 'Something went wrong',
  description,
  action,
}: ErrorStateProps) {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={2} py={6}>
      <Alert severity="error" sx={{ width: '100%', maxWidth: 480 }}>
        <Typography fontWeight={600} mb={0.5}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Alert>
      {action}
    </Stack>
  )
}
