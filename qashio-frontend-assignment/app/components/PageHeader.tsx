'use client';

import { Stack, Typography } from '@mui/material';
import type { StackProps } from '@mui/material';

interface PageHeaderProps extends StackProps {
  title: string
  description?: string
  action?: React.ReactNode
  prefix?: React.ReactNode
}

export default function PageHeader({
  title,
  description,
  action,
  prefix,
  sx,
  ...stackProps
}: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-start', md: 'center' }}
      justifyContent="space-between"
      spacing={2}
      sx={{
        p: 4,
        borderBottom: (theme) => `1px solid ${theme.palette.layout.borderLight}`,
        ...sx,
      }}
      {...stackProps}
    >
      <Stack spacing={1}>
        {prefix}
        <Typography variant="h4" fontWeight={600}>
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary">
            {description}
          </Typography>
        )}
      </Stack>
      {action}
    </Stack>
  )
}
