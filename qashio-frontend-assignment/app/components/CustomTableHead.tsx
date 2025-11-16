'use client';

import { TableHead, TableRow, TableCell } from '@mui/material';

export interface TableHeaderColumn {
  label: string
  align?: 'left' | 'right' | 'center'
}

interface SimpleTableHeadProps {
  columns: TableHeaderColumn[]
}

export default function CustomTableHead({ columns }: SimpleTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell key={column.label} align={column.align}>
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
