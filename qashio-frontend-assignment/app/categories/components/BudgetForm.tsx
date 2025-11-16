'use client';

import { Box, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useForm } from 'react-hook-form';

export interface BudgetFormValues {
  amount: number
  startDate: Date | null
  endDate: Date | null
}

interface BudgetFormProps {
  formId?: string
  defaultValues?: BudgetFormValues
  onSubmit: (values: BudgetFormValues) => void
  disabled?: boolean
}

export default function BudgetForm({ formId, defaultValues, onSubmit, disabled }: BudgetFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<BudgetFormValues>({
    defaultValues: defaultValues ?? {
      amount: 0,
      startDate: null,
      endDate: null,
    },
  })

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ mt: 1 }}>
        <TextField
          label="Budget Amount"
          type="number"
          inputProps={{ min: 0, step: '0.01' }}
          disabled={disabled}
          error={Boolean(errors.amount)}
          helperText={errors.amount?.message}
          {...register('amount', {
            required: 'Amount is required',
            valueAsNumber: true,
            validate: (value) => (value > 0 ? true : 'Enter a valid amount'),
          })}
        />
        <Controller
          name="startDate"
          control={control}
          rules={{ required: 'Start date is required' }}
          render={({ field, fieldState }) => (
            <DatePicker
              label="Start Date"
              value={field.value}
              onChange={(value) => field.onChange(value ?? null)}
              disabled={disabled}
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
        <Controller
          name="endDate"
          control={control}
          rules={{
            required: 'End date is required',
            validate: (value, formValues) => {
              if (!value || !formValues.startDate) return true
              return value >= formValues.startDate || 'End date must be after start date'
            },
          }}
          render={({ field, fieldState }) => (
            <DatePicker
              label="End Date"
              value={field.value}
              onChange={(value) => field.onChange(value ?? null)}
              disabled={disabled}
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
    </Box>
  )
}
