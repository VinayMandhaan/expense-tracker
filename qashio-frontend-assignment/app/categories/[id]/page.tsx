'use client';

import * as React from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  Divider,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import PrimaryActionButton from '@/app/components/PrimaryActionButton';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiGet, apiSend } from '@/lib/api';
import type { CategorySummary } from '@/app/types';
import { extractErrorMessage, formatCurrency } from '@/lib/utils';
import { CustomCard } from '@/app/components/CustomCard';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


export default function CategoryDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const categoryId = params?.id
  const {
    data: summary,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['category', 'summary', categoryId],
    queryFn: () => apiGet<CategorySummary>(`/categories/${categoryId}/summary`),
    enabled: Boolean(categoryId),
  })
  const [budgetDialogOpen, setBudgetDialogOpen] = React.useState(false)
  const [budgetAmount, setBudgetAmount] = React.useState('')
  const [budgetStartDate, setBudgetStartDate] = React.useState<Date | null>(null)
  const [budgetEndDate, setBudgetEndDate] = React.useState<Date | null>(null)
  const [budgetErrors, setBudgetErrors] = React.useState({
    amount: null as string | null,
    startDate: null as string | null,
    endDate: null as string | null,
  })
  const [isBudgetSaving, setIsBudgetSaving] = React.useState(false)
  const [budgetErrorMessage, setBudgetErrorMessage] = React.useState<string | null>(null)
  const [budgetSuccess, setBudgetSuccess] = React.useState(false)

  const toApiDate = (date: Date | null) => (date ? date.toISOString().split('T')[0] : '')
  const resetBudgetForm = () => {
    setBudgetAmount('')
    setBudgetStartDate(null)
    setBudgetEndDate(null)
    setBudgetErrors({ amount: null, startDate: null, endDate: null })
    setBudgetErrorMessage(null)
    setBudgetSuccess(false)
  }
  const openBudgetDialog = () => {
    resetBudgetForm()
    setBudgetDialogOpen(true)
  }
  const closeBudgetDialog = () => {
    setBudgetDialogOpen(false)
    resetBudgetForm()
  }

  const handleBudgetSubmit = async () => {
    if (!summary) return
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
    setBudgetErrorMessage(null)
    try {
      await apiSend('/budget', 'POST', {
        amount: amountValue,
        categoryId: summary.category.id,
        startDate: toApiDate(budgetStartDate),
        endDate: toApiDate(budgetEndDate),
      })
      setBudgetSuccess(true)
      refetch()
    } catch (err) {
      setBudgetErrorMessage(extractErrorMessage(err, 'Failed to create budget'))
    } finally {
      setIsBudgetSaving(false)
    }
  }

  if (!categoryId) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant='h5' fontWeight={600}>Invalid category</Typography>
        <Button sx={{ mt: 2 }} onClick={() => router.push('/categories')}>Back to categories</Button>
      </Box>
    )
  }

  if (isError) {
    return (
      <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ p: 4 }}>
        <Alert severity="error" sx={{ maxWidth: 400, width: '100%' }}>
          Failed to load category
          <Typography variant="body2" color="text.secondary">
            {extractErrorMessage(error, 'Something went wrong')}
          </Typography>
        </Alert>
        <Stack direction="row" spacing={1}>
          <PrimaryActionButton onClick={() => refetch()}>
            Retry
          </PrimaryActionButton>
          <Button onClick={() => router.push('/categories')} startIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </Stack>
      </Stack>
    )
  }

  if (isLoading || !summary) {
    return (
      <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ p: 4 }}>
        <CircularProgress size={32} />
        <Typography color="text.secondary">Loading categor</Typography>
      </Stack>
    )
  }
  const { category, currentBudget, budgets, totalSpent } = summary
  const progress = currentBudget && currentBudget.amount > 0 ? Math.min(100, (currentBudget.spent / currentBudget.amount) * 100) : 0

  return (
    <>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        sx={(theme) => ({
          p: 4,
          borderBottom: `1px solid ${theme.palette.layout.borderLight}`,
          gap: 2,
        })}
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
              '&:hover': { borderColor: '#c5c5c5', bgcolor: '#f7f7f7' },
            }}
          >
            Back
          </PrimaryActionButton>
          <Typography variant="h4" fontWeight={600}>
            {category.name}
          </Typography>
        </Stack>
        <PrimaryActionButton startIcon={<AddIcon />} onClick={openBudgetDialog}>
          Add Budget
        </PrimaryActionButton>
      </Stack>

      <Box sx={{ p: 4, pt: 3 }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <CustomCard label="Total Spent" value={formatCurrency(totalSpent)} />
            <CustomCard
              label="Current Budget"
              value={
                currentBudget ? formatCurrency(currentBudget.amount) : 'No active budget'
              }
              subtTitle={
                currentBudget
                  ? `${currentBudget.startDate} – ${currentBudget.endDate}`
                  : undefined
              }
            />
            <CustomCard
              label="Remaining"
              value={
                currentBudget ? formatCurrency(currentBudget.remaining) : formatCurrency(0)
              }
            />
          </Stack>

          {currentBudget && (
            <Paper variant="outlined" sx={{ borderRadius: 4, borderColor: '#ececec', p: 3 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight={600}>Budget usage</Typography>
                  <Chip
                    label={currentBudget.remaining >= 0 ? 'On Track' : 'Exceeded'}
                    color={currentBudget.remaining >= 0 ? 'success' : 'error'}
                    size="small"
                  />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 10, borderRadius: 999 }}
                />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Spent {formatCurrency(currentBudget.spent)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Remaining {formatCurrency(currentBudget.remaining)}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          )}

          <Paper variant="outlined">
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              sx={{ p: 3, pb: 0, gap: 2 }}
            >
              <Stack>
                <Typography variant="h6" fontWeight={600}>
                  Budget Timeline
                </Typography>
                <Typography color="text.secondary">
                  Historical view of budget periods
                </Typography>
              </Stack>
            </Stack>
            <Divider sx={{ mt: 2 }} />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Period</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Spent</TableCell>
                  <TableCell>Remaining</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {budgets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography color="text.secondary" textAlign="center">
                        No budgets found for this category
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  budgets.map((budget) => {
                    const status = budget.remaining >= 0 ? 'On Track' : 'Exceeded'
                    return (
                      <TableRow key={budget.id}>
                        <TableCell>
                          <Typography fontWeight={600}>
                            {budget.startDate} – {budget.endDate}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatCurrency(budget.amount)}</TableCell>
                        <TableCell>{formatCurrency(budget.spent)}</TableCell>
                        <TableCell>{formatCurrency(budget.remaining)}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={status}
                            color={budget.remaining >= 0 ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </Paper>
        </Stack>
      </Box>

      <Dialog open={budgetDialogOpen} onClose={closeBudgetDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{budgetSuccess ? 'Budget Added' : 'Add a Budget'}</DialogTitle>
        <DialogContent dividers>
          {budgetSuccess ? (
            <Stack spacing={1}>
              <Alert severity="success">Budget created successfully!</Alert>
              <Typography>
                Budget updates will appear in this category overview right away.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              {budgetErrorMessage && <Alert severity="error">{budgetErrorMessage}</Alert>}
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
        </DialogContent>
        <DialogActions>
          {budgetSuccess ? (
            <PrimaryActionButton onClick={closeBudgetDialog}>Done</PrimaryActionButton>
          ) : (
            <>
              <Button onClick={closeBudgetDialog} disabled={isBudgetSaving}>
                Cancel
              </Button>
              <PrimaryActionButton onClick={handleBudgetSubmit} disabled={isBudgetSaving}>
                {isBudgetSaving ? 'Saving...' : 'Save Budget'}
              </PrimaryActionButton>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}
