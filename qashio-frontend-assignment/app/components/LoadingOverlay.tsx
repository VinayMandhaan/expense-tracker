'use client';

import { Box, CircularProgress, Stack, Typography } from '@mui/material';

interface LoadingOverlayProps {
  message?: string
}

export default function LoadingOverlay({ message = 'Updating' }: LoadingOverlayProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: 'rgba(255,255,255,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Stack spacing={1} alignItems="center">
        <CircularProgress size={24} />
        <Typography variant="caption" color="text.secondary">
          {message}
        </Typography>
      </Stack>
    </Box>
  )
}
