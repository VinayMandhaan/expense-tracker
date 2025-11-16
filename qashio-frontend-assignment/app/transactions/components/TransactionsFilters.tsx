'use client';

import { Stack, TextField, InputAdornment, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { FilterOption } from '../types';
import { FilterSelect } from './FilterSelect';

interface TransactionsFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  typeValue: string
  onTypeChange: (value: string) => void
  categoryValue: string
  onCategoryChange: (value: string) => void
  typeOptions: ReadonlyArray<FilterOption>
  categoryOptions: ReadonlyArray<FilterOption>
  isCategoryLoading: boolean
}

export function TransactionsFilters({
  search,
  onSearchChange,
  typeValue,
  onTypeChange,
  categoryValue,
  onCategoryChange,
  typeOptions,
  categoryOptions,
  isCategoryLoading,
}: TransactionsFiltersProps) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      <TextField
        placeholder="Search using amount"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
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
          value={typeValue}
          onChange={onTypeChange}
          options={typeOptions}
        />
        <FilterSelect
          label="Category"
          value={categoryValue}
          onChange={onCategoryChange}
          options={categoryOptions}
          disabled={isCategoryLoading && categoryOptions.length === 1}
        />
      </Stack>
    </Stack>
  )
}
