'use client';

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import { parseSortParam, areSortModelsEqual } from '../utils/sort.util'
import { createTransactionQueryHandlers } from '../utils/queryHandlers'

export function useTransactionQueryState() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const initialSearch = searchParams.get('search') || ''
  const [q, setQ] = React.useState(initialSearch)
  const [debouncedQ, setDebouncedQ] = React.useState(initialSearch)
  const initialPage = Math.max(0, Number(searchParams.get('page') || '1') - 1)
  const initialPageSize = Number(searchParams.get('limit') || '10')
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: Number.isNaN(initialPage) ? 0 : initialPage,
    pageSize: Number.isNaN(initialPageSize) ? 10 : initialPageSize,
  })
  const [sortModel, setSortModel] = React.useState<GridSortModel>(() => parseSortParam(searchParams.get('sort')))
  const [typeFilter, setTypeFilter] = React.useState<string>(searchParams.get('type') || '')
  const [categoryFilter, setCategoryFilter] = React.useState<string>(searchParams.get('categoryId') || '')
  const lastSearchRef = React.useRef(initialSearch.trim())

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ((prev) => (prev === q ? prev : q))
    }, 400)
    return () => clearTimeout(handler)
  }, [q])

  const handlers = React.useMemo(() => createTransactionQueryHandlers({
    searchParams,
    pathname,
    router,
    setPaginationModel,
    setSortModel,
    setTypeFilter,
    setCategoryFilter,
  }), [searchParams, pathname, router, setPaginationModel, setSortModel, setTypeFilter, setCategoryFilter])

  const {
    resetToFirstPage,
    handleSortModelChange,
    handleTypeChange,
    handleCategoryChange,
    handlePaginationChange,
    updateQueryParams,
  } = handlers

  React.useEffect(() => {
    const paramsSearch = searchParams.get('search') || ''
    setQ((prev) => (prev === paramsSearch ? prev : paramsSearch))
    setDebouncedQ((prev) => (prev === paramsSearch ? prev : paramsSearch))

    const paramsType = searchParams.get('type') || ''
    setTypeFilter((prev) => (prev === paramsType ? prev : paramsType))

    const paramsCategory = searchParams.get('categoryId') || ''
    setCategoryFilter((prev) => (prev === paramsCategory ? prev : paramsCategory))

    const nextPage = Math.max(0, Number(searchParams.get('page') || '1') - 1)
    const nextLimit = Number(searchParams.get('limit') || '10')
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

  React.useEffect(() => {
    const trimmed = debouncedQ.trim()
    if (trimmed === lastSearchRef.current) {
      return
    }
    lastSearchRef.current = trimmed
    updateQueryParams({ search: trimmed || null, page: '1' })
  }, [debouncedQ, updateQueryParams])

  return {
    q,
    setQ,
    debouncedQ,
    typeFilter,
    categoryFilter,
    paginationModel,
    sortModel,
    resetToFirstPage,
    handleSortModelChange,
    handleTypeChange,
    handleCategoryChange,
    handlePaginationChange,
  }
}
