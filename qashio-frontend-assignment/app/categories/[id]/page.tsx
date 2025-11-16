'use client';

import * as React from 'react'
import { Button, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import { useParams, useRouter } from 'next/navigation'
import PrimaryActionButton from '@/app/components/PrimaryActionButton'
import PageHeader from '@/app/components/PageHeader'
import ErrorState from '@/app/components/ErrorState'
import LoadingState from '@/app/components/LoadingState'
import AppDialog from '@/app/components/dialogs/AppDialog'
import { extractErrorMessage } from '@/lib/utils'
import CategoryDetailContent from '@/app/categories/components/CategoryDetailContent'
import BudgetDialogContent from '@/app/categories/components/BudgetDialogContent'
import { useCategoryDetail } from '@/app/categories/hooks/useCategoryDetail'
import { PageContainer } from '../components/PageContainer';

export default function CategoryDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const categoryId = params?.id
  const {
    summary,
    isLoading,
    isError,
    error,
    refetch,
    budgetDialogOpen,
    openBudgetDialog,
    closeBudgetDialog,
    budgetState,
    handleBudgetSubmit,
    handleBudgetDelete,
    budgetDeletionError,
    deletingBudgetId,
  } = useCategoryDetail(categoryId)

  const btnComponent = (
    <PrimaryActionButton
      startIcon={<ArrowBackIcon />}
      onClick={() => router.push('/categories')}
      sx={{
        borderColor: '#e0e0e0',
        color: '#5f6368',
        borderRadius: 2,
        px: 2,
      }}
    >
      Back
    </PrimaryActionButton>
  )

  const headerAction = summary ? (
    <PrimaryActionButton startIcon={<AddIcon />} onClick={openBudgetDialog}>Add Budget</PrimaryActionButton>
  ) : undefined

  const renderState = () => {
    if (!categoryId) {
      return (
        <PageContainer>
          <ErrorState title="Invalid category" description="Please select a valid category to view details."
            action={(<Button onClick={() => router.push('/categories')} startIcon={<ArrowBackIcon />}>Back to categories</Button>)}
          />
        </PageContainer>
      )
    }

    if (isError) {
      return (
        <PageContainer>
          <ErrorState
            title="Failed to load category" description={extractErrorMessage(error, 'Something went wrong')}
            action={(
              <Stack direction="row" spacing={1} justifyContent="center">
                <PrimaryActionButton onClick={() => refetch()}>Retry</PrimaryActionButton>
                <Button onClick={() => router.push('/categories')} startIcon={<ArrowBackIcon />}>Back</Button>
              </Stack>
            )}
          />
        </PageContainer>
      )
    }

    if (isLoading || !summary) {
      return (
        <PageContainer>
          <LoadingState message="Loading category" />
        </PageContainer>
      )
    }

    return (
      <CategoryDetailContent
        summary={summary}
        budgetDeletionError={budgetDeletionError}
        deletingBudgetId={deletingBudgetId}
        onDeleteBudget={handleBudgetDelete}
      />
    )
  }

  return (
    <>
      <PageHeader title={summary?.category.name ? 'Category' : ''} prefix={btnComponent} action={headerAction} />
      {renderState()}
      {summary && (
        <AppDialog
          open={budgetDialogOpen}
          onClose={closeBudgetDialog}
          maxWidth="sm"
          fullWidth
          dividers
          title={budgetState.budgetSuccess ? 'Budget Added' : 'Add a Budget'}
          actions={
            budgetState.budgetSuccess ? (
              <PrimaryActionButton onClick={closeBudgetDialog}>Done</PrimaryActionButton>
            ) : (
              <>
                <Button onClick={closeBudgetDialog} disabled={budgetState.isBudgetSaving}>
                  Cancel
                </Button>
                <PrimaryActionButton type="submit" form="category-budget-form" disabled={budgetState.isBudgetSaving}>
                  {budgetState.isBudgetSaving ? 'Saving...' : 'Save Budget'}
                </PrimaryActionButton>
              </>
            )
          }
        >
          <BudgetDialogContent
            showForm={!budgetState.budgetSuccess}
            success={budgetState.budgetSuccess}
            errorMessage={budgetState.budgetErrorMessage}
            isSaving={budgetState.isBudgetSaving}
            onSubmit={handleBudgetSubmit}
            formId="category-budget-form"
            successDescription="Budget updates will appear in this category overview right away."
          />
        </AppDialog>
      )}
    </>
  )
}
