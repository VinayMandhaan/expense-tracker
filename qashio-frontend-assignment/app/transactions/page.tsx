'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import Link from 'next/link';
import TransactionDrawer from '../components/TransactionDrawer';
import PrimaryActionButton from '../components/PrimaryActionButton';
import { Paginated, Transaction, Category } from '../types';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';

type FilterOption = { label: string; value: string }
const typeOptions: FilterOption[] = [
  { label: 'All', value: '' },
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
]

function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: FilterOption[]
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <TextField
      select
      size="small"
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      sx={{ minWidth: 150 }}
    >
      {options.map((option) => (
        <MenuItem key={option.value || 'all'} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

function TypeChip({ type }: { type: Transaction['type'] }) {
  const isIncome = type === 'income'
  return (
    <Chip
      label={isIncome ? 'Income' : 'Expense'}
      size="small"
      sx={{
        textTransform: 'capitalize',
        fontWeight: 600,
        borderRadius: 999,
        px: 0.5,
        bgcolor: isIncome ? 'rgba(65, 189, 141, 0.15)' : 'rgba(239, 83, 80, 0.15)',
        color: isIncome ? '#1c8c62' : '#c62828',
      }}
    />
  )
}

export default function TransactionsPage() {
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Transaction | null>(null)
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'date', sort: 'desc' },
  ])
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  const formatAmount = useCallback((value?: string | number | null) => {
    const amount = typeof value === 'number' ? value : typeof value === 'string' ? Number.parseFloat(value) : NaN
    if (!Number.isFinite(amount)) return '-'
    return amount.toLocaleString()
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ((prev) => (prev === q ? prev : q))
    }, 400)
    return () => clearTimeout(handler)
  }, [q])

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories', 'list'],
    queryFn: () => apiGet<Category[]>('/categories'),
  })

  const categoryOptions = useMemo<FilterOption[]>(() => {
    const opts = categoriesData?.map((category) => ({
      label: category.name,
      value: category.id,
    })) ?? []
    return [{ label: 'All', value: '' }, ...opts]
  }, [categoriesData])

  const sortParam = useMemo(() => {
    const activeSorts = sortModel.filter(item => item.sort)

    const sortStrings = activeSorts.map(item => `${item.field}:${item.sort}`)

    return sortStrings.join(',')
  }, [sortModel])

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['transactions', paginationModel.page, paginationModel.pageSize, debouncedQ, typeFilter, categoryFilter, sortParam],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(paginationModel.page + 1),
        limit: String(paginationModel.pageSize),
      })
      if (debouncedQ.trim()) params.set('search', debouncedQ.trim())
      if (typeFilter) params.set('type', typeFilter)
      if (categoryFilter) params.set('categoryId', categoryFilter)
      if (sortParam) params.set('sort', sortParam)
      return apiGet<Paginated<Transaction>>(`/transactions?${params.toString()}`)
    },
  })

  const rows = data?.items ?? []
  const totalRows = data?.meta.total ?? 0
  const errorMessage = error ? error.message : 'Something went wrong'

  const resetToFirstPage = useCallback(() => {
    setPaginationModel(prev => {
      if (prev.page === 0) return prev
      return { ...prev, page: 0 }
    })
  }, [])

  const handleSortModelChange = useCallback(
    (model: GridSortModel) => {
      setSortModel(model)
      resetToFirstPage()
    },
    [resetToFirstPage],
  )

  const handleTypeChange = useCallback(
    (value: string) => {
      setTypeFilter(value)
      resetToFirstPage()
    },
    [resetToFirstPage],
  )

  const handleCategoryChange = useCallback(
    (value: string) => {
      setCategoryFilter(value)
      resetToFirstPage()
    },
    [resetToFirstPage],
  )

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => params?.row?.date ?? '',
      renderCell: (params) => (
        <>
          {params.row.date}
        </>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <>
          {params.row.category?.name ?? '-'}
        </>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0.6,
      minWidth: 140,
      renderCell: (params) => <TypeChip type={params.row.type} />,
      sortable: false,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.6,
      minWidth: 150,
      valueGetter: (params) => {
        const amount = params?.row?.amount
        return typeof amount === 'string' ? Number.parseFloat(amount) : amount ?? 0
      },
      renderCell: (params) => {
        const formatted = formatAmount(params.row.amount)
        return (
          <>
            {formatted === '-' ? '-' : `${formatted} AED`}
          </>
        )
      },
    },
  ]

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 4, borderBottom: (theme) => `1px solid ${theme.palette.layout.borderLight}` }}
      >
        <Typography variant="h4" fontWeight={600}>
          Transactions
        </Typography>
        <PrimaryActionButton
          component={Link}
          href="/transactions/new"
          startIcon={<AddIcon />}
        >
          New Transaction
        </PrimaryActionButton>
      </Stack>

      <Box sx={{ p: 4, pt: 3, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
        >
          <TextField
            placeholder="Search using amount"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            sx={{ width: { xs: '100%', md: 300 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                height: 48,
              },
            }}
          />
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            <FilterSelect
              label="Type"
              value={typeFilter}
              options={typeOptions}
              onChange={handleTypeChange}
            />
            <FilterSelect
              label="Category"
              value={categoryFilter}
              options={categoryOptions}
              onChange={handleCategoryChange}
              disabled={isCategoriesLoading && categoryOptions.length === 1}
            />
          </Stack>
        </Stack>

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
            <Stack alignItems="center" justifyContent="center" py={8} spacing={2}>
              <Typography color="error.main" fontWeight={600}>
                Failed to load transactions
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {errorMessage}
              </Typography>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={() => refetch()}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Retry
              </Button>
            </Stack>
          ) : data?.items?.length == 0 ? (
            <Stack alignItems="center" justifyContent="center" py={6} spacing={1}>
                <Typography fontWeight={600}>No transactions yet</Typography>
                <Typography color="text.secondary" variant="body2">
                  Create your first transaction to start tracking budgets.
                </Typography>
                <PrimaryActionButton
                  startIcon={<AddIcon />}
                  component={Link}
                  href="/transactions/new"
                  sx={{ mt: 1 }}
                >
                  New Transaction
                </PrimaryActionButton>
              </Stack>
          ) : (
            <DataGrid
              rows={rows}
              rowCount={totalRows}
              getRowId={(row) => row.id}
              columns={columns}
              paginationMode="server"
              sortingMode="server"
              sortModel={sortModel}
              paginationModel={paginationModel}
              onPaginationModelChange={(model) =>
                setPaginationModel((prev) =>
                  prev.page === model.page && prev.pageSize === model.pageSize
                    ? prev
                    : { page: model.page, pageSize: model.pageSize },
                )
              }
              onSortModelChange={handleSortModelChange}
              pageSizeOptions={[10, 25, 40]}
              checkboxSelection
              disableColumnMenu
              disableRowSelectionOnClick
              hideFooterSelectedRowCount
              loading={isLoading || isFetching}
              onRowClick={(params) => {
                setSelected(params.row)
                setOpen(true)
              }}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': (theme) => ({
                  bgcolor: '#fbfbfb',
                  borderBottom: `1px solid ${theme.palette.layout.borderLight}`,
                  color: '#737373',
                }),
              }}
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
