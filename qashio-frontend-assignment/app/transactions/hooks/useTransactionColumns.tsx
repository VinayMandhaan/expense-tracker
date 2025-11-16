'use client';

import { useMemo } from 'react';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { TypeChip } from '../components/TypeChip';
import { Transaction } from '../types';

export function useTransactionColumns(): GridColDef[] {
  return useMemo(() => {
    const formatAmount = (value?: number | null) => {
      if (value === null || value === undefined) return '-'
      return Number(value).toLocaleString()
    }
    const formatDate = (value?: string | null) => {
      if (!value) return '-'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const columns: GridColDef[] = [
      {
        field: 'date',
        headerName: 'Date',
        flex: 1,
        minWidth: 150,
        valueGetter: (params) => params?.row?.date ?? '',
        renderCell: (params: GridRenderCellParams<Transaction>) => formatDate(params.row.date),
      },
      {
        field: 'category',
        headerName: 'Category',
        flex: 1,
        minWidth: 180,
        sortable: false,
        renderCell: (params: GridRenderCellParams<Transaction>) => params.row.category?.name ?? '-',
      },
      {
        field: 'type',
        headerName: 'Type',
        flex: 0.6,
        minWidth: 140,
        renderCell: (params: GridRenderCellParams<Transaction>) => {
          const transactionType = params.row.type
          return <TypeChip type={transactionType} />
        },
        sortable: false,
      },
      {
        field: 'amount',
        headerName: 'Amount',
        flex: 0.6,
        minWidth: 150,
        valueGetter: (params) => params?.row?.amount ?? 0,
        renderCell: (params: GridRenderCellParams<Transaction>) => {
          const formatted = formatAmount(params.row.amount)
          return formatted === '-' ? '-' : `${formatted} AED`
        },
      },
    ]

    return columns
  }, [])
}
