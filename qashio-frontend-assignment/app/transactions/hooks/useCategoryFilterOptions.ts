'use client';

import { useMemo } from 'react'
import { useCategories } from '@/app/hooks/useCategories'
import type { FilterOption } from '../types'

export function useCategoryFilterOptions() {
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories()

  const categoryOptions = useMemo<FilterOption[]>(() => {
    const opts = categoriesData?.map((category) => ({
      label: category.name,
      value: category.id,
    })) ?? []
    return [{ label: 'All', value: '' }, ...opts]
  }, [categoriesData])

  return { categoryOptions, isCategoriesLoading }
}
