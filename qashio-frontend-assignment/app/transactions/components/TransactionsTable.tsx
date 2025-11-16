'use client';

import { DataGrid, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useTransactionColumns } from '../hooks/useTransactionColumns';
import { Transaction } from '../types';

interface TransactionsTableProps {
  rows: Transaction[]
  rowCount: number
  paginationModel: GridPaginationModel
  onPaginationChange: (model: GridPaginationModel) => void
  sortModel: GridSortModel
  onSortModelChange: (model: GridSortModel) => void
  loading: boolean
  onRowClick: (transaction: Transaction) => void
}

export function TransactionsTable({
  rows,
  rowCount,
  paginationModel,
  onPaginationChange,
  sortModel,
  onSortModelChange,
  loading,
  onRowClick,
}: TransactionsTableProps) {
  const columns = useTransactionColumns()

  return (
    <DataGrid
      rows={rows}
      rowCount={rowCount}
      getRowId={(row) => row.id}
      columns={columns}
      paginationMode="server"
      sortingMode="server"
      sortModel={sortModel}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationChange}
      onSortModelChange={onSortModelChange}
      pageSizeOptions={[10, 25, 40]}
      checkboxSelection
      disableColumnMenu
      disableRowSelectionOnClick
      hideFooterSelectedRowCount
      loading={loading}
      onRowClick={(params) => onRowClick(params.row)}
      sx={{
        border: 'none',
        '& .MuiDataGrid-columnHeaders': (theme) => ({
          bgcolor: '#fbfbfb',
          borderBottom: `1px solid ${theme.palette.layout.borderLight}`,
          color: '#737373',
        }),
      }}
    />
  )
}
