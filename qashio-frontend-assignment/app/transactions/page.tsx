'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Paper, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import TransactionDrawer from '../components/TransactionDrawer';
import PrimaryActionButton from '../components/PrimaryActionButton';
import { Transaction } from '../types';
import { useCategories } from '../hooks/useCategories';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionsFilters } from './components/TransactionsFilters';
import { TransactionsTable } from './components/TransactionsTable';
import type { FilterOption } from './types';
import { typeOptions } from './constants';
import PageHeader from '../components/PageHeader';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { parseSortParam, sortModelToString, areSortModelsEqual } from './utils/sort.util';
import { createTransactionQueryHandlers } from './utils/queryHandlers';

export default function TransactionsPage() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const initialSearch = searchParams.get('search') || ''
  const [q, setQ] = useState(initialSearch)
  const [debouncedQ, setDebouncedQ] = useState(initialSearch)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Transaction | null>(null)
  const initialPage = Math.max(0, Number(searchParams.get('page') || '1') - 1)
  const initialPageSize = Number(searchParams.get('limit') ?? '10')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: Number.isNaN(initialPage) ? 0 : initialPage,
    pageSize: Number.isNaN(initialPageSize) ? 10 : initialPageSize,
  })
  const [sortModel, setSortModel] = useState<GridSortModel>(() => {
    return parseSortParam(searchParams.get('sort'))
  })
  const [typeFilter, setTypeFilter] = useState<string>(searchParams.get('type') || '')
  const [categoryFilter, setCategoryFilter] = useState<string>(searchParams.get('categoryId') ?? '')
  const lastSearchRef = useRef(initialSearch.trim())

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ((prev) => (prev === q ? prev : q))
    }, 400)
    return () => clearTimeout(handler)
  }, [q])

  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories()
  const categoryOptions = useMemo<FilterOption[]>(() => {
    const opts = categoriesData?.map((category) => ({
      label: category.name,
      value: category.id,
    })) ?? []
    return [{ label: 'All', value: '' }, ...opts]
  }, [categoriesData])
  
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

  const rows = data?.items ?? []
  const totalRows = data?.meta.total ?? 0
  const errorMessage = error ? error.message : 'Something went wrong'
  const {
    resetToFirstPage,
    handleSortModelChange,
    handleTypeChange,
    handleCategoryChange,
    handlePaginationChange,
    updateQueryParams,
  } = createTransactionQueryHandlers({
    searchParams,
    pathname,
    router,
    setPaginationModel,
    setSortModel,
    setTypeFilter,
    setCategoryFilter,
  })

  const handleRowClick = React.useCallback((transaction: Transaction) => {
    setSelected(transaction)
    setOpen(true)
  }, [])

  useEffect(() => {
    const paramsSearch = searchParams.get('search') ?? ''
    setQ((prev) => (prev === paramsSearch ? prev : paramsSearch))
    setDebouncedQ((prev) => (prev === paramsSearch ? prev : paramsSearch))
    const paramsType = searchParams.get('type') ?? ''
    setTypeFilter((prev) => (prev === paramsType ? prev : paramsType))
    const paramsCategory = searchParams.get('categoryId') ?? ''
    setCategoryFilter((prev) => (prev === paramsCategory ? prev : paramsCategory))
    const nextPage = Math.max(0, Number(searchParams.get('page') ?? '1') - 1)
    const nextLimit = Number(searchParams.get('limit') ?? '10')
    setPaginationModel((prev) => (
      prev.page === nextPage && prev.pageSize === nextLimit
        ? prev
        : {
          page: Number.isNaN(nextPage) ? 0 : nextPage,
          pageSize: Number.isNaN(nextLimit) ? prev.pageSize : nextLimit,
        }
    ))
    const nextSort = parseSortParam(searchParams.get('sort'))
    setSortModel((prev) => (areSortModelsEqual(prev, nextSort) ? prev : nextSort))
  }, [searchParams])

  useEffect(() => {
    const trimmed = debouncedQ.trim()
    if (trimmed === lastSearchRef.current) {
      return
    }
    lastSearchRef.current = trimmed
    updateQueryParams({ search: trimmed || null, page: '1' })
  }, [debouncedQ, updateQueryParams])

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Browse and manage company transactions."
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
                <PrimaryActionButton startIcon={<AddIcon />} component={Link} href="/transactions/new" sx={{ mt: 1 }}>
                  New Transaction
                </PrimaryActionButton>
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
      <TransactionDrawer
        open={open}
        onClose={() => setOpen(false)}
        selectedData={selected}
        onUpdated={(updated) => setSelected(updated)}
        onDeleted={() => setSelected(null)}
      />
    </>
  )
}
