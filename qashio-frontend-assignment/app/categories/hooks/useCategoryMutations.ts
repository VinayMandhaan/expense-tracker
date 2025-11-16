import { useCallback } from 'react'
import type { QueryClient, UseQueryResult } from '@tanstack/react-query'
import { extractErrorMessage, toApiDate } from '@/lib/utils'
import { BudgetFormValues } from '../components/BudgetForm'
import { createCategoryBudget, deleteCategoryBudget } from '../request/categoryRequest'
import type { CategorySummary } from '../types'

interface UseCategoryBudgetMutationsParams {
  query: UseQueryResult<CategorySummary>
  queryClient: QueryClient
  setIsBudgetSaving: (value: boolean) => void
  setBudgetErrorMessage: (value: string | null) => void
  setBudgetSuccess: (value: boolean) => void
  setBudgetDeletionError: (value: string | null) => void
  setDeletingBudgetId: (value: string | null) => void
}

export function useCategoryMutations({
  query,
  queryClient,
  setIsBudgetSaving,
  setBudgetErrorMessage,
  setBudgetSuccess,
  setBudgetDeletionError,
  setDeletingBudgetId,
}: UseCategoryBudgetMutationsParams) {
  const handleBudgetSubmit = useCallback(
    async (values: BudgetFormValues) => {
      if (!query.data || !values.startDate || !values.endDate) {
        return
      }
      setIsBudgetSaving(true)
      setBudgetErrorMessage(null)
      try {
        await createCategoryBudget({
          amount: values.amount,
          categoryId: query.data.category.id,
          startDate: toApiDate(values.startDate),
          endDate: toApiDate(values.endDate),
        })
        setBudgetSuccess(true)
        await query.refetch()
        queryClient.invalidateQueries({ queryKey: ['categories', 'summary'] })
      } catch (err) {
        setBudgetErrorMessage(extractErrorMessage(err, 'Failed to create budget'))
      } finally {
        setIsBudgetSaving(false)
      }
    },
    [query, queryClient, setIsBudgetSaving, setBudgetErrorMessage, setBudgetSuccess]
  )

  const handleBudgetDelete = useCallback(
    async (budgetId: string) => {
      if (!budgetId) {
        return
      }
      if (!window.confirm('Delete this budget period?')) {
        return
      }
      setDeletingBudgetId(budgetId)
      setBudgetDeletionError(null)
      try {
        await deleteCategoryBudget(budgetId)
        await query.refetch()
        queryClient.invalidateQueries({ queryKey: ['categories', 'summary'] })
      } catch (err) {
        setBudgetDeletionError(extractErrorMessage(err, 'Failed to delete budget'))
      } finally {
        setDeletingBudgetId(null)
      }
    },
    [query, queryClient, setDeletingBudgetId, setBudgetDeletionError]
  )

  return { handleBudgetSubmit, handleBudgetDelete }
}
