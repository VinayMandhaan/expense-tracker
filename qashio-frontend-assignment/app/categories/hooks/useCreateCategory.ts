import * as React from 'react'
import { extractErrorMessage, toApiDate } from '@/lib/utils'
import { Category } from '../types'
import { CategoryFormValues } from '../components/CategoryForm'
import { BudgetFormValues } from '../components/BudgetForm'
import { createCategory, createCategoryBudget } from '../request/categoryRequest'

interface UseCreateCategoryOptions {
  onFinished: () => void
}

export function useCreateCategory({ onFinished }: UseCreateCategoryOptions) {
  const [isSaving, setIsSaving] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [createdCategory, setCreatedCategory] = React.useState<Category | null>(null)
  const [budgetDialogOpen, setBudgetDialogOpen] = React.useState(false)
  const [showBudgetForm, setShowBudgetForm] = React.useState(false)
  const [isBudgetSaving, setIsBudgetSaving] = React.useState(false)
  const [budgetSuccess, setBudgetSuccess] = React.useState(false)
  const [budgetError, setBudgetError] = React.useState<string | null>(null)

  const handleSubmit = async ({ name }: CategoryFormValues) => {
    if (!name.trim()) {
      return
    }
    setSubmitError(null)
    setIsSaving(true)
    try {
      const category = await createCategory({ name: name.trim() })
      setCreatedCategory(category)
      setShowBudgetForm(false)
      setBudgetSuccess(false)
      setBudgetError(null)
      setBudgetDialogOpen(true)
    } catch (err) {
      setSubmitError(extractErrorMessage(err, 'Failed to create category'))
    } finally {
      setIsSaving(false)
    }
  }

  const resetDialog = () => {
    setBudgetDialogOpen(false)
    setShowBudgetForm(false)
    setBudgetSuccess(false)
    setBudgetError(null)
    setCreatedCategory(null)
  }

  const closeDialogAndExit = () => {
    resetDialog()
    onFinished()
  }

  const handleBudgetSubmit = async (values: BudgetFormValues) => {
    if (!createdCategory || !values.startDate || !values.endDate) {
      return
    }
    setIsBudgetSaving(true)
    setBudgetError(null)
    try {
      await createCategoryBudget({
        amount: values.amount,
        categoryId: createdCategory.id,
        startDate: toApiDate(values.startDate),
        endDate: toApiDate(values.endDate),
      })
      setBudgetSuccess(true)
    } catch (err) {
      setBudgetError(extractErrorMessage(err, 'Failed to create budget'))
    } finally {
      setIsBudgetSaving(false)
    }
  }

  return {
    isSaving,
    submitError,
    handleSubmit,
    dialog: {
      open: budgetDialogOpen,
      showBudgetForm,
      success: budgetSuccess,
      errorMessage: budgetError,
      isBudgetSaving,
      close: closeDialogAndExit,
      openBudgetForm: () => setShowBudgetForm(true),
      handleBudgetSubmit,
    },
  }
}
