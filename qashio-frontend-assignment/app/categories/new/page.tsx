'use client';

import * as React from 'react'
import { Alert, Divider, Paper, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { useRouter } from 'next/navigation'
import PrimaryActionButton from '@/app/components/PrimaryActionButton'
import PageHeader from '@/app/components/PageHeader'
import CategoryForm from '@/app/categories/components/CategoryForm'
import CategoryCreateDialog from '@/app/categories/components/CategoryCreateDialog'
import { PageContainer } from '@/app/categories/components/PageContainer'
import { useCreateCategory } from '@/app/categories/hooks/useCreateCategory'

export default function CreateCategoryPage() {
  const router = useRouter()
  const { isSaving, submitError, handleSubmit, dialog } = useCreateCategory({
    onFinished: () => router.push('/categories'),
  })

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

  const headerAction = (
    <Stack direction="row" spacing={1.5}>
      <PrimaryActionButton variant="text" sx={{ border: 'none', color: '#5f6368' }} onClick={() => router.push('/categories')}>
        Cancel
      </PrimaryActionButton>
      <PrimaryActionButton startIcon={<SaveIcon />} type="submit" form="create-category-form" disabled={isSaving}>
        {isSaving ? 'Saving' : 'Save Category'}
      </PrimaryActionButton>
    </Stack>
  )

  return (
    <>
      <PageHeader
        title="New Category"
        description="Create a category and optionally seed its first budget."
        prefix={btnComponent}
        action={headerAction}
        sx={{ pb: 3 }}
      />

      <PageContainer>
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: '#ececec', p: { xs: 3, md: 4 }, maxWidth: 640 }}>
          <Stack spacing={3}>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            <CategoryForm formId="create-category-form" onSubmit={handleSubmit} />
            <Divider />
          </Stack>
        </Paper>
      </PageContainer>

      <CategoryCreateDialog
        open={dialog.open}
        showBudgetForm={dialog.showBudgetForm}
        success={dialog.success}
        isSaving={dialog.isBudgetSaving}
        errorMessage={dialog.errorMessage}
        onClose={dialog.close}
        onShowBudgetForm={dialog.openBudgetForm}
        onSubmitBudget={dialog.handleBudgetSubmit}
      />
    </>
  )
}
