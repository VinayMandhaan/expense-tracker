'use client';

import { Box, Stack, TextField, InputAdornment, ToggleButtonGroup, ToggleButton, MenuItem, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { TransactionFormProps, TransactionFormValues } from '../types';

const formError = {
  amount: { required: 'Amount is required' },
  date: { required: 'Date is required' },
  categoryId: { required: 'Category is required' },
}

export default function TransactionForm({
  formId,
  defaultValues,
  categories,
  isCategoryLoading,
  onSubmit,
}: TransactionFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<TransactionFormValues>({
    defaultValues,
  })

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Amount"
            fullWidth
            type="number"
            inputProps={{ min: 0, step: '0.01' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography>AED</Typography>
                </InputAdornment>
              ),
            }}
            error={Boolean(errors.amount)}
            helperText={errors.amount?.message}
            {...register('amount', {
              required: formError.amount.required,
              valueAsNumber: true,
              validate: (value) => (value > 0 ? true : 'Amount must be greater than 0'),
            })}
          />
          <Controller
            control={control}
            name="date"
            rules={{ required: formError.date.required }}
            render={({ field, fieldState }) => (
              <DatePicker
                label="Date"
                value={field.value}
                onChange={(value) => field.onChange(value ?? null)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(fieldState.error),
                    helperText: fieldState.error?.message,
                  },
                }}
              />
            )}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary">Type</Typography>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                exclusive
                value={field.value}
                onChange={(_event, value) => {
                  if (!value) return
                  field.onChange(value)
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
            )}
          />
        </Stack>

        <Controller
          name="categoryId"
          control={control}
          rules={{ required: formError.categoryId.required }}
          render={({ field, fieldState }) => (
            <TextField
              select
              label="Category"
              fullWidth
              disabled={isCategoryLoading || categories.length === 0}
              value={field.value ?? ''}
              onChange={field.onChange}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
            >
              <MenuItem value="" disabled>
                {isCategoryLoading ? 'Loading' : 'Select a category'}
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Stack>
    </Box>
  )
}
