'use client';

import React, { useMemo, useState } from 'react';
import { Box, Paper, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import Link from 'next/link';
import CustomDrawer from '../components/CustomDrawer';
import PrimaryActionButton from '../components/PrimaryActionButton';
import { useTransactions } from '../hooks/useTransactions';
import { useTransactionQueryState } from './hooks/useTransactionQueryState';
import { useCategoryFilterOptions } from './hooks/useCategoryFilterOptions';
import { TransactionsFilters } from './components/TransactionsFilters';
import { TransactionsTable } from './components/TransactionsTable';
import type { Transaction } from './types';
import { typeOptions } from './constants';
import PageHeader from '../components/PageHeader';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { sortModelToString } from './utils/sort.util';

export default function TransactionsPage() {
  const {
    q,
    setQ,
    debouncedQ,
    typeFilter,
    categoryFilter,
    paginationModel,
    sortModel,
    handleSortModelChange,
    handleTypeChange,
    handleCategoryChange,
    handlePaginationChange,
  } = useTransactionQueryState()
  const { categoryOptions, isCategoriesLoading } = useCategoryFilterOptions()
  const sortParam = useMemo(() => sortModelToString(sortModel), [sortModel])
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useTransactions({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: debouncedQ,
    type: typeFilter || undefined,
    categoryId: categoryFilter || undefined,
    sort: sortParam || undefined,
  })

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Transaction | null>(null)

  const rows = data?.items ?? []
  const totalRows = data?.meta.total ?? 0
  const errorMessage = error ? error.message : 'Something went wrong'

  const handleRowClick = React.useCallback((transaction: Transaction) => {
    setSelected(transaction)
    setOpen(true)
  }, [])

  return (
    <>
      <PageHeader title="Transactions" description="Browse and manage company transactions."
        action={(
          <PrimaryActionButton
            component={Link}
            href="/transactions/new"
            startIcon={<AddIcon />}
          >
            New Transaction
          </PrimaryActionButton>
        )}
      />

      <Box sx={{ p: 4, pt: 3, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TransactionsFilters
          search={q}
          onSearchChange={setQ}
          typeValue={typeFilter}
          onTypeChange={handleTypeChange}
          categoryValue={categoryFilter}
          onCategoryChange={handleCategoryChange}
          typeOptions={typeOptions}
          categoryOptions={categoryOptions}
          isCategoryLoading={isCategoriesLoading}
        />

        <Paper
          variant="outlined"
          sx={{
            flex: 1,
            borderRadius: 3,
            borderColor: '#ececec',
            overflow: 'hidden',
          }}
        >
          {isError ? (
            <ErrorState title="Failed to load transactions" description={errorMessage}
              action={(
                <Button variant="contained" startIcon={<RefreshIcon />} onClick={() => refetch()} sx={{ textTransform: 'none', borderRadius: 2 }}>Retry</Button>
              )}
            />
          ) : isLoading && !data ? (
            <LoadingState message="Loading transactions…" />
          ) : rows.length === 0 ? (
            <EmptyState title="No transactions yet" description="Create your first transaction to start tracking budgets."
              action={(
                <PrimaryActionButton startIcon={<AddIcon />} component={Link} href="/transactions/new" sx={{ mt: 1 }}> New Transaction</PrimaryActionButton>
              )}
            />
          ) : (
            <TransactionsTable
              rows={rows}
              rowCount={totalRows}
              paginationModel={paginationModel}
              onPaginationChange={handlePaginationChange}
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              loading={isFetching}
              onRowClick={handleRowClick}
            />
          )}
        </Paper>
      </Box>
      <CustomDrawer
        open={open}
        onClose={() => setOpen(false)}
        selectedData={selected}
        onUpdated={(updated) => setSelected(updated)}
        onDeleted={() => setSelected(null)}
      />
    </>
  )
}
