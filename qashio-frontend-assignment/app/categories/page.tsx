'use client';

import * as React from 'react';
import {
  Box,
  Stack,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrimaryActionButton from '../components/PrimaryActionButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { CustomCard } from '../components/CustomCard';
import PageHeader from '../components/PageHeader';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import LoadingOverlay from '../components/LoadingOverlay';
import { useCategoriesSummary } from './hooks/useCategoriesSummary';
import CategoryRow from './components/CategoryRow';
import CategoryTableHead from './components/CategoryTableHead';
import { getCategoryStats } from './utils/categoryUtils';

export default function CategoriesPage() {
  const router = useRouter()
  const { data, isLoading, isError, error, refetch, isFetching } = useCategoriesSummary()
  const summaries = data ? data : []
  const stats = React.useMemo(() => getCategoryStats(summaries), [summaries])

  return (
    <>
      <PageHeader title="Categories" description="Track budgets and spending per category."
        action={(
          <PrimaryActionButton startIcon={<AddIcon />} component={Link} href="/categories/new">New Category</PrimaryActionButton>
        )}
      />
      <Box sx={{ p: 4, pt: 3 }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <CustomCard label="Categories" value={`${stats.totalCategories}`} />
            <CustomCard label="Active Budget" value={formatCurrency(stats.totalBudget)} />
            <CustomCard label="Remaining" value={formatCurrency(stats.totalRemaining)} />
          </Stack>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              borderColor: '#ececec',
              minHeight: 240,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isFetching && !isLoading && <LoadingOverlay message="Updating" />}
            {isLoading ? (
              <LoadingState message="Loading categories…" />
            ) : isError ? (
              <ErrorState
                title="Failed to load categories" description={error instanceof Error ? error.message : 'Something went wrong'}
                action={(
                  <Button variant="contained" onClick={() => refetch()}>Retry</Button>
                )}
              />
            ) : summaries.length === 0 ? (
              <EmptyState
                title="No categories yet" description="Create your first category to start tracking budgets."
                action={(
                  <PrimaryActionButton startIcon={<AddIcon />} component={Link} href="/categories/new" sx={{ mt: 1 }}>New Category</PrimaryActionButton>
                )}
              />
            ) : (
              <TableContainer>
                <Table>
                  <CategoryTableHead />
                  <TableBody>
                    {summaries.map((summary) => (
                      <CategoryRow key={summary.category.id} summary={summary} onSelect={(id) => router.push(`/categories/${id}`)} />
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
