'use client';

import * as React from 'react';
import { Box, Paper, Stack, Alert, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PrimaryActionButton from '@/app/components/PrimaryActionButton';
import { useRouter } from 'next/navigation';
import { apiSend } from '@/lib/api';
import { extractErrorMessage, toApiDate } from '@/lib/utils';
import TransactionForm from '@/app/transactions/components/TransactionForm';
import { useCategories } from '@/app/hooks/useCategories';
import PageHeader from '@/app/components/PageHeader';
import { TransactionFormValues } from '../types';

export default function CreateTransactionPage() {
  const router = useRouter()
  const [saving, setSaving] = React.useState(false)
  const [transactionError, setTransactionError] = React.useState<null | string>(null)
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()

  const handleSubmit = async (values: TransactionFormValues) => {
    if (!values.date) {
      return
    }
    try {
      setSaving(true)
      setTransactionError(null)
      await apiSend('/transactions', 'POST', {
        amount: values.amount,
        date: toApiDate(values.date),
        type: values.type,
        categoryId: values.categoryId,
      })
      router.push('/transactions')
    } catch (err) {
      console.log(err)
      setTransactionError(extractErrorMessage(err, 'Failed to create transaction'))
    } finally {
      setSaving(false)
    }
  }

  const headerAction = (
    <Stack direction="row" spacing={1.5}>
      <PrimaryActionButton
        variant="text"
        sx={{ border: 'none', color: '#5f6368' }}
        onClick={() => router.push('/transactions')}
      >
        Cancel
      </PrimaryActionButton>
      <PrimaryActionButton
        type="submit"
        form="create-transaction-form"
        disabled={saving}
        startIcon={<SaveIcon />}
      >
        {saving ? 'Saving' : 'Save Transaction'}
      </PrimaryActionButton>
    </Stack>
  )

  return (
    <>
      <PageHeader
        title="New Transaction" description="Capture a new transaction with amount, category, type, and date."
        prefix={(
          <PrimaryActionButton onClick={() => router.push('/transactions')} startIcon={<ArrowBackIcon />}
            sx={{
              borderRadius: 2,
              borderColor: '#e0e0e0',
              color: '#5f6368',
              px: 2,
            }}
          >
            Back
          </PrimaryActionButton>
        )}
        action={headerAction}
        sx={{ pb: 3 }}
      />

      {transactionError && <Alert severity="error">{transactionError}</Alert>}
      <Box sx={{ p: 4 }}>
        <Paper
          variant="outlined"
          sx={{ borderRadius: 3, borderColor: '#ececec', p: { xs: 3, md: 4 }, maxWidth: 720 }}
        >
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight={600}>Transaction Details</Typography>
            <TransactionForm
              formId="create-transaction-form"
              defaultValues={{ amount: 0, date: new Date(), type: 'income', categoryId: '' }}
              categories={categories}
              isCategoryLoading={categoriesLoading}
              onSubmit={handleSubmit}
            />
          </Stack>
        </Paper>
      </Box>
    </>
  )
}