'use client';

import { Stack, Alert, Typography } from '@mui/material';
import BudgetForm, { BudgetFormValues } from './BudgetForm';

interface BudgetDialogContentProps {
  showForm: boolean
  success: boolean
  errorMessage?: string | null
  isSaving?: boolean
  onSubmit: (values: BudgetFormValues) => void
  formId: string
  successDescription?: string
  successTitle?: string
}

export default function BudgetDialogContent({
  showForm,
  success,
  errorMessage,
  isSaving,
  onSubmit,
  formId,
  successDescription = 'Budget updated.',
  successTitle = 'Budget created.',
}: BudgetDialogContentProps) {
  if (success) {
    return (
      <Stack spacing={1}>
        <Alert severity="success">{successTitle}</Alert>
        <Typography>{successDescription}</Typography>
      </Stack>
    )
  }

  if (!showForm) {
    return null
  }

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <BudgetForm
        formId={formId}
        onSubmit={onSubmit}
        disabled={isSaving}
      />
    </Stack>
  )
}
