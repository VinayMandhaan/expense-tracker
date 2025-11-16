import * as React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet } from '@/lib/api'
import { extractErrorMessage, toApiDate } from '@/lib/utils'
import { CategorySummary } from '../types'
import { BudgetFormValues } from '../components/BudgetForm'
import { createCategoryBudget, deleteCategoryBudget } from '../request/categoryRequest'

export function useCategoryDetail(categoryId?: string) {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['category', 'summary', categoryId],
    queryFn: () => apiGet<CategorySummary>(`/categories/${categoryId}/summary`),
    enabled: Boolean(categoryId),
  })

  const [budgetDialogOpen, setBudgetDialogOpen] = React.useState(false)
  const [isBudgetSaving, setIsBudgetSaving] = React.useState(false)
  const [budgetErrorMessage, setBudgetErrorMessage] = React.useState<string | null>(null)
  const [budgetSuccess, setBudgetSuccess] = React.useState(false)
  const [budgetDeletionError, setBudgetDeletionError] = React.useState<string | null>(null)
  const [deletingBudgetId, setDeletingBudgetId] = React.useState<string | null>(null)

  const resetBudgetForm = React.useCallback(() => {
    setBudgetErrorMessage(null)
    setBudgetSuccess(false)
  }, [])

  const openBudgetDialog = React.useCallback(() => {
    resetBudgetForm()
    setBudgetDialogOpen(true)
  }, [resetBudgetForm])

  const closeBudgetDialog = React.useCallback(() => {
    setBudgetDialogOpen(false)
    resetBudgetForm()
  }, [resetBudgetForm])

  const handleBudgetSubmit = React.useCallback(
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
    [query, queryClient]
  )

  const handleBudgetDelete = React.useCallback(
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
    [query, queryClient]
  )

  return {
    summary: query.data,
    ...query,
    budgetDialogOpen,
    openBudgetDialog,
    closeBudgetDialog,
    budgetState: {
      isBudgetSaving,
      budgetErrorMessage,
      budgetSuccess,
    },
    handleBudgetSubmit,
    handleBudgetDelete,
    budgetDeletionError,
    deletingBudgetId,
  }
}
