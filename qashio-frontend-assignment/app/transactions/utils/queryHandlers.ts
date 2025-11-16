import type { Dispatch, SetStateAction } from 'react';
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { sortModelToString } from './sort.util';

interface HandlerDeps {
  searchParams: ReadonlyURLSearchParams
  pathname: string
  router: AppRouterInstance
  setPaginationModel: Dispatch<SetStateAction<GridPaginationModel>>
  setSortModel: Dispatch<SetStateAction<GridSortModel>>
  setTypeFilter: Dispatch<SetStateAction<string>>
  setCategoryFilter: Dispatch<SetStateAction<string>>
}

export function createTransactionQueryHandlers({
  searchParams,
  pathname,
  router,
  setPaginationModel,
  setSortModel,
  setTypeFilter,
  setCategoryFilter,
}: HandlerDeps) {
  
  const updateQueryParams = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    const queryString = params.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(url, { scroll: false })
  }

  const resetToFirstPage = (extraUpdates?: Record<string, string | null | undefined>) => {
    setPaginationModel((prev) => {
      if (prev.page === 0) return prev
      return { ...prev, page: 0 }
    })
    updateQueryParams({ page: '1', ...(extraUpdates ?? {}) })
  }

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model)
    const sortString = sortModelToString(model)
    resetToFirstPage({ sort: sortString || null })
  }

  const handleTypeChange = (value: string) => {
    setTypeFilter(value)
    resetToFirstPage({ type: value || null })
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    resetToFirstPage({ categoryId: value || null })
  }

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model)
    updateQueryParams({
      page: String(model.page + 1),
      limit: String(model.pageSize),
    })
  }

  return {
    updateQueryParams,
    resetToFirstPage,
    handleSortModelChange,
    handleTypeChange,
    handleCategoryChange,
    handlePaginationChange,
  }
}
