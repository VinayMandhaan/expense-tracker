'use client';

import * as React from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PrimaryActionButton from '@/app/components/PrimaryActionButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from 'next/navigation';
import { apiSend } from '@/lib/api';
import type { Category } from '@/app/types';
import { extractErrorMessage } from '@/lib/utils';

export default function CreateCategoryPage() {
  const router = useRouter()
  const [categoryName, setCategoryName] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [createdCategory, setCreatedCategory] = React.useState<Category | null>(null)
  const [budgetDialogOpen, setBudgetDialogOpen] = React.useState(false)
  const [showBudgetForm, setShowBudgetForm] = React.useState(false)
  const [budgetAmount, setBudgetAmount] = React.useState('')
  const [budgetStartDate, setBudgetStartDate] = React.useState<Date | null>(null)
  const [budgetEndDate, setBudgetEndDate] = React.useState<Date | null>(null)
  const [budgetErrors, setBudgetErrors] = React.useState({
    amount: null as string | null,
    startDate: null as string | null,
    endDate: null as string | null,
  })
  const [isBudgetSaving, setIsBudgetSaving] = React.useState(false)
  const [budgetSuccess, setBudgetSuccess] = React.useState(false)
  const [budgetError, setBudgetError] = React.useState<string | null>(null)

  const toApiDate = (date: Date | null) => {
    return date ? date.toISOString().split('T')[0] : ''
  }



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!categoryName.trim()) return
    setSubmitError(null)
    setIsSaving(true)
    try {
      const category = await apiSend<Category>('/categories', 'POST', { name: categoryName.trim() })
      setCreatedCategory(category)
      setShowBudgetForm(false)
      setBudgetSuccess(false)
      setBudgetAmount('')
      setBudgetStartDate(null)
      setBudgetEndDate(null)
      setBudgetErrors({ amount: null, startDate: null, endDate: null })
      setBudgetError(null)
      setBudgetDialogOpen(true)
    } catch (err) {
      setSubmitError(extractErrorMessage(err, 'Failed to create category'))
    } finally {
      setIsSaving(false)
    }
  }

  const closeDialogAndExit = () => {
    setBudgetDialogOpen(false)
    setShowBudgetForm(false)
    setBudgetSuccess(false)
    setBudgetAmount('')
    setBudgetStartDate(null)
    setBudgetEndDate(null)
    setBudgetErrors({ amount: null, startDate: null, endDate: null })
    setBudgetError(null)
    setCreatedCategory(null)
    router.push('/categories')
  }

  const handleBudgetSubmit = async () => {
    if (!createdCategory) return
    let hasError = false
    const nextErrors = { amount: null as string | null, startDate: null as string | null, endDate: null as string | null }
    const amountValue = Number.parseFloat(budgetAmount)
    if (!budgetAmount.trim()) {
      nextErrors.amount = 'Amount is required'
      hasError = true
    } else if (!Number.isFinite(amountValue) || amountValue <= 0) {
      nextErrors.amount = 'Enter a valid amount'
      hasError = true
    }
    if (!budgetStartDate) {
      nextErrors.startDate = 'Start date is required'
      hasError = true
    }
    if (!budgetEndDate) {
      nextErrors.endDate = 'End date is required'
      hasError = true
    } else if (budgetStartDate && budgetEndDate < budgetStartDate) {
      nextErrors.endDate = 'End date must be after start date'
      hasError = true
    }
    setBudgetErrors(nextErrors)
    if (hasError) return
    setIsBudgetSaving(true)
    setBudgetError(null)
    try {
      await apiSend('/budget', 'POST', {
        amount: amountValue,
        categoryId: createdCategory.id,
        startDate: toApiDate(budgetStartDate),
        endDate: toApiDate(budgetEndDate),
      })
      setBudgetSuccess(true)
    } catch (err) {
      setBudgetError(extractErrorMessage(err, 'Failed to create budget'))
    } finally {
      setIsBudgetSaving(false)
    }
  }

  return (
    <>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        sx={{ p: 4, pb: 3, borderBottom: '1px solid #f0f0f0', gap: 2 }}
      >
        <Stack spacing={1}>
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
          <Typography variant="h4" fontWeight={600}>
            New Category
          </Typography>
          <Typography color="text.secondary">
            Create a category and optionally seed its first budget.
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <PrimaryActionButton
            variant="text"
            sx={{ border: 'none', color: '#5f6368' }}
            onClick={() => router.push('/categories')}
          >
            Cancel
          </PrimaryActionButton>
          <PrimaryActionButton
            startIcon={<SaveIcon />}
            type="submit"
            form="create-category-form"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Category'}
          </PrimaryActionButton>
        </Stack>
      </Stack>

      <Box component="form" id="create-category-form" onSubmit={handleSubmit} sx={{ p: 4 }}>
        <Paper
          variant="outlined"
          sx={{ borderRadius: 3, borderColor: '#ececec', p: { xs: 3, md: 4 }, maxWidth: 640 }}
        >
          <Stack spacing={3}>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            <TextField
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              fullWidth
              required
            />
            <Divider />
          </Stack>
        </Paper>
      </Box>

      <Dialog open={budgetDialogOpen} onClose={closeDialogAndExit} maxWidth="sm" fullWidth>
        <DialogTitle>
          {budgetSuccess ? 'Budget Added' : showBudgetForm ? 'Add a Budget' : 'Category Created'}
        </DialogTitle>
        <DialogContent dividers>
          {!showBudgetForm && !budgetSuccess && (
            <Typography>
              Category was created successfully. Would you like to add a budget for this category now?
            </Typography>
          )}
          {showBudgetForm && !budgetSuccess && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              {budgetError && <Alert severity="error">{budgetError}</Alert>}
              <TextField
                label="Budget Amount"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                type="number"
                inputProps={{ min: 0, step: '0.01' }}
                error={Boolean(budgetErrors.amount)}
                helperText={budgetErrors.amount}
                fullWidth
              />
              <DatePicker
                label="Start Date"
                value={budgetStartDate}
                onChange={(value) => setBudgetStartDate(value ?? null)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(budgetErrors.startDate),
                    helperText: budgetErrors.startDate,
                  },
                }}
              />
              <DatePicker
                label="End Date"
                value={budgetEndDate}
                onChange={(value) => setBudgetEndDate(value ?? null)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(budgetErrors.endDate),
                    helperText: budgetErrors.endDate,
                  },
                }}
              />
            </Stack>
          )}
          {budgetSuccess && (
            <Stack spacing={1}>
              <Alert severity="success">Budget created successfully!</Alert>
              <Typography>
                You can manage this category and its budgets anytime from the categories page.
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          {!showBudgetForm && !budgetSuccess && (
            <>
              <Button onClick={closeDialogAndExit}>Maybe later</Button>
              <PrimaryActionButton onClick={() => setShowBudgetForm(true)}>
                Add Budget
              </PrimaryActionButton>
            </>
          )}
          {showBudgetForm && !budgetSuccess && (
            <>
              <Button onClick={closeDialogAndExit} disabled={isBudgetSaving}>
                Skip
              </Button>
              <PrimaryActionButton onClick={handleBudgetSubmit} disabled={isBudgetSaving}>
                {isBudgetSaving ? 'Saving...' : 'Save Budget'}
              </PrimaryActionButton>
            </>
          )}
          {budgetSuccess && (
            <PrimaryActionButton onClick={closeDialogAndExit}>
              Done
            </PrimaryActionButton>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}
