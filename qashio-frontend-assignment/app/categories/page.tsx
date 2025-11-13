'use client';

import * as React from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrimaryActionButton from '../components/PrimaryActionButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CategorySummary } from '../types';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { CustomCard } from '../components/CustomCard';


const RenderCategory = ({ summary }: { summary: CategorySummary }) => {
  const router = useRouter()
  const currentBudget = summary.currentBudget
  const progress = currentBudget && currentBudget.amount > 0 ? Math.min(100, (currentBudget.spent / currentBudget.amount) * 100) : 0
  const statusLabel = currentBudget ? currentBudget.remaining >= 0 ? 'On Track' : 'Exceeded' : 'No Budget'
  const statusColor = currentBudget ? currentBudget.remaining >= 0 ? 'success' : 'error' : 'default'

  return (
    <TableRow
      hover
      onClick={() => {
      }}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell sx={{ fontWeight: 600 }}>{summary.category.name}</TableCell>
      <TableCell>
        {currentBudget ? (
          <Stack spacing={1}>
            <Typography fontWeight={600}>{formatCurrency(currentBudget.amount)}</Typography>
            <Typography variant="caption" color="text.secondary">{currentBudget.startDate} – {currentBudget.endDate}</Typography>
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
            <Typography variant="caption" color="text.secondary"> {progress.toFixed(0)}% used</Typography>
          </Stack>
        )}
      </TableCell>
      <TableCell>
        <Chip
          label={statusLabel}
          color={statusColor as any}
          size="small"
        />
      </TableCell>
    </TableRow>
  )
}

export default function CategoriesPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['categories', 'summary'],
    queryFn: () => apiGet<CategorySummary[]>('/categories/summary'),
  })

  const summaries = data ? data : []
  const stats = React.useMemo(() => {
    const totalCategories = summaries.length
    const totalBudget = summaries.reduce((sum, summary) => sum + (summary.currentBudget?.amount ? summary.currentBudget?.amount : 0), 0)
    const totalRemaining = summaries.reduce((sum, summary) => sum + (summary.currentBudget?.remaining ? summary.currentBudget?.remaining : 0), 0)
    return {
      totalCategories,
      totalBudget,
      totalRemaining,
    };
  }, [summaries])

  return (
    <>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        sx={{ p: 4, borderBottom: '1px solid #f0f0f0', gap: 2 }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={600}>
            Categories
          </Typography>
          <Typography color="text.secondary">
            Track budgets and spending per category.
          </Typography>
        </Stack>
        <PrimaryActionButton startIcon={<AddIcon />} component={Link} href="/categories/new">
          New Category
        </PrimaryActionButton>
      </Stack>

      <Box sx={{ p: 4, pt: 3 }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <CustomCard label="Categories" value={`${stats.totalCategories}`} />
            <CustomCard label="Active Budget" value={formatCurrency(stats.totalBudget)} />
            <CustomCard label="Remaining" value={formatCurrency(stats.totalRemaining)} />
          </Stack>
          <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: '#ececec', minHeight: 240 }}>
            {isLoading ? (
              <Stack alignItems="center" justifyContent="center" py={6} spacing={2}>
                <CircularProgress size={32} />
                <Typography color="text.secondary">Loading categories…</Typography>
              </Stack>
            ) : isError ? (
              <Stack alignItems="center" justifyContent="center" py={6} spacing={2}>
                <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
                  Failed to load categories
                  <Typography variant="body2" color="text.secondary">
                    {error instanceof Error ? error.message : 'Something went wrong'}
                  </Typography>
                </Alert>
                <Button variant="contained" onClick={() => refetch()}>
                  Retry
                </Button>
              </Stack>
            ) : summaries.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" py={6} spacing={1}>
                <Typography fontWeight={600}>No categories yet</Typography>
                <Typography color="text.secondary" variant="body2">
                  Create your first category to start tracking budgets.
                </Typography>
                <PrimaryActionButton
                  startIcon={<AddIcon />}
                  component={Link}
                  href="/categories/new"
                  sx={{ mt: 1 }}
                >
                  New Category
                </PrimaryActionButton>
              </Stack>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Current Budget</TableCell>
                      <TableCell>Total Spent</TableCell>
                      <TableCell>Remaining</TableCell>
                      <TableCell>Utilization</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summaries.map((summary) => (
                      <RenderCategory key={summary.category.id} summary={summary} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Stack>
      </Box>
    </>
  )
}
