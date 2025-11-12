'use client';

import React, { useCallback, useState } from 'react';
import { Box, Paper, Stack, Typography, Button, TextField, InputAdornment, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import Link from 'next/link';
import TransactionDrawer from '../components/TransactionDrawer';
import PrimaryActionButton from '../components/PrimaryActionButton';
import { Paginated, Transaction } from '../types';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';

const filterButtons = ['Date', 'Reference', 'Amount', 'Status']

function FilterPill({ label }: { label: string }) {
  return (
    <Button
      variant="text"
      endIcon={<KeyboardArrowDownIcon />}
      sx={{
        textTransform: 'none',
        color: '#6f6f74',
        fontWeight: 500,
        borderRadius: 2,
        px: 1.5,
      }}
    >
      {label}
    </Button>
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
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Transaction | null>(null)
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })

  const formatAmount = useCallback((value?: string | number | null) => {
    const amount = typeof value === 'number' ? value : typeof value === 'string' ? Number.parseFloat(value) : NaN
    if (!Number.isFinite(amount)) return '-'
    return amount.toLocaleString()
  }, [])

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['transactions', paginationModel.page, paginationModel.pageSize, q],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(paginationModel.page + 1),
        limit: String(paginationModel.pageSize),
      })
      if (q.trim()) params.set('search', q.trim())
      return apiGet<Paginated<Transaction>>(`/transactions?${params.toString()}`)
    },
  })

  const rows = data?.items ?? []
  const totalRows = data?.meta.total ?? 0
  const errorMessage = error ? error.message : 'Something went wrong'

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
            placeholder="Search..."
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
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {filterButtons.map((label) => (
              <FilterPill key={label} label={label} />
            ))}
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
          ) : (
            <DataGrid
              rows={rows}
              rowCount={totalRows}
              getRowId={(row) => row.id}
              columns={columns}
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
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
      <TransactionDrawer open={open} onClose={() => setOpen(false)} tx={selected} />
    </>
  )
}
