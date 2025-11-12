'use client';

import { NAV_ITEMS, NavKey } from '@/lib/utils';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode
  activeNav?: NavKey
}

export default function PageLayout({ children, activeNav = 'transactions' }: PageLayoutProps) {
  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', p: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          borderRadius: 4,
          overflow: 'hidden',
          minHeight: 'calc(100vh - 64px)',
          border: '1px solid #ececec',
        }}
      >
        <Box
          sx={{
            width: 250,
            bgcolor: '#fff',
            borderRight: '1px solid #ece2d6',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              Company
            </Typography>
          </Stack>
          <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />
          <Stack spacing={1.5}>
            {NAV_ITEMS.map(({ key, label, href, icon: Icon }) => {
              const isActive = key === activeNav;
              return (
                <Button
                  key={key}
                  component={Link}
                  href={href}
                  startIcon={<Icon />}
                  variant={isActive ? 'contained' : 'text'}
                  disableElevation
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    height: 40,
                    fontWeight: 500,
                    borderRadius: 2,
                    color: isActive ? '#fff' : '#A78F65',
                    bgcolor: isActive ? '#9c7c4b' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive ? '#8a6f44' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Stack>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
          {children}
        </Box>
      </Paper>
    </Box>
  )
}
