'use client';

import * as React from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Divider,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CategoryIcon from '@mui/icons-material/Category';
import PrimaryActionButton from '@/app/components/PrimaryActionButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@/app/types';
import { apiGet, apiSend } from '@/lib/api';
import { extractErrorMessage } from '@/lib/utils';

type Errors = {
  amount: string | null;
  date: string | null;
  categoryId: string | null;
};


export default function CreateTransactionPage() {
  const router = useRouter()
  const [amount, setAmount] = React.useState('')
  const [date, setDate] = React.useState(new Date())
  const [type, setType] = React.useState('income')
  const [categoryId, setCategoryId] = React.useState('')
  const initialErrors: Errors = { amount: null, date: null, categoryId: null }
  const [errors, setErrors] = React.useState<Errors>(initialErrors)
  const [saving, setSaving] = React.useState(false)
  const [transactionError, setTransactionError] = React.useState<null | string>(null)
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return apiGet<Category[]>(`/categories`);
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!(Number(amount) > 0)) {
      setErrors((prev) => ({ ...prev, amount: 'Amount should be greater than 0' }))
    } else if (!date) {
      setErrors((prev) => ({ ...prev, amount: 'Date is required' }))
    } else if (!categoryId) {
      setErrors((prev) => ({ ...prev, amount: 'Category is required' }))
    } else {
      try {
        setSaving(true)
        await apiSend('/transactions', 'POST', {
          amount: Number(amount),
          date: date ? date.toISOString().split('T')[0] : '',
          type: type,
          categoryId: categoryId,
        }).then((res) => {
          router.push('/transactions')
          setSaving(false)
        })
      }
      catch (err) {
        console.error(err)
        setTransactionError(extractErrorMessage(err, 'Failed to create budget'))
        setSaving(false)

      }
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
          <Stack direction="row" spacing={1} alignItems="center">
            <PrimaryActionButton
              onClick={() => router.push('/transactions')}
              startIcon={<ArrowBackIcon />}
              sx={{
                borderRadius: 2,
                borderColor: '#e0e0e0',
                color: '#5f6368',
                px: 2,
                '&:hover': { borderColor: '#c5c5c5', bgcolor: '#f7f7f7' },
              }}
            >
              Back
            </PrimaryActionButton>
            <Typography variant="h4" fontWeight={600}>
              New Transaction
            </Typography>
          </Stack>
          <Typography color="text.secondary">
            Capture a new transaction with amount, category, type, and date.
          </Typography>
        </Stack>
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
      </Stack>

      {transactionError && <Alert severity="error">{transactionError}</Alert>}
      <Box component="form" id="create-transaction-form" onSubmit={handleSubmit} sx={{ p: 4 }}>
        <Paper
          variant="outlined"
          sx={{ borderRadius: 3, borderColor: '#ececec', p: { xs: 3, md: 4 }, maxWidth: 720 }}
        >
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight={600}>
              Transaction Details
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Amount"
                fullWidth
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  setErrors((prev) => ({ ...prev, amount: null }))
                }}
                type="number"
                error={Boolean(errors.amount)}
                helperText={errors.amount}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography>AED</Typography>
                    </InputAdornment>
                  ),
                }}
              />
              <DatePicker
                label="Date"
                value={date}
                onChange={(value) => {
                  setDate(value ?? new Date())
                  setErrors((prev) => ({ ...prev, date: null }))

                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(errors.date),
                    helperText: errors.date,
                  },
                }}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Type
              </Typography>
              <ToggleButtonGroup
                exclusive
                value={type}
                onChange={(_event, value) => {
                  setType(value)
                }}
                color="primary"
              >
                <ToggleButton value="income" sx={{ px: 3 }}>
                  Income
                </ToggleButton>
                <ToggleButton value="expense" sx={{ px: 3 }}>
                  Expense
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            {
              data && data.length > 0 && (
                <TextField
                  select
                  label="Category"
                  disabled={isLoading || !data.length}
                  fullWidth
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value)
                    setErrors((prev) => ({ ...prev, categoryId: null }))

                  }}
                  error={Boolean(errors.categoryId)}
                  helperText={errors.categoryId}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                >
                  {data && data.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              )
            }
            <Divider />
          </Stack>
        </Paper>
      </Box>
    </>
  )
}

