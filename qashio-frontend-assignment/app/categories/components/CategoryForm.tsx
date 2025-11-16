'use client';

import { Box, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

export interface CategoryFormValues {
  name: string
}

interface CategoryFormProps {
  formId?: string
  defaultValues?: CategoryFormValues
  onSubmit: (values: CategoryFormValues) => void
}

export default function CategoryForm({ formId, defaultValues, onSubmit }: CategoryFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormValues>({
    defaultValues: defaultValues ?? { name: '' },
  })

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          label="Category Name"
          fullWidth
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register('name', {
            required: 'Category name is required',
            minLength: { value: 2, message: 'Must be at least 2 characters' },
          })}
        />
      </Stack>
    </Box>
  )
}
