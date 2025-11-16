import * as React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CategorySummary } from '../types'
import { getCategorySummary } from '../request/categoryRequest'
import { useCategoryMutations } from './useCategoryMutations'

export function useCategoryDetail(categoryId?: string) {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['category', 'summary', categoryId],
    queryFn: () => (categoryId ? getCategorySummary(categoryId) : Promise.reject(new Error('No category'))),
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

  const { handleBudgetSubmit, handleBudgetDelete } = useCategoryMutations({
    query,
    queryClient,
    setIsBudgetSaving,
    setBudgetErrorMessage,
    setBudgetSuccess,
    setBudgetDeletionError,
    setDeletingBudgetId,
  })

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
