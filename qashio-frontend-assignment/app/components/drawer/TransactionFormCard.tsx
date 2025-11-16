import { Stack, Typography } from '@mui/material'
import DrawerCard from './DrawerCard'
import TransactionForm from '../../transactions/components/TransactionForm'
import { Category } from '../../categories/types'
import { Transaction, TransactionFormValues } from '../../transactions/types'

interface TransactionFormCardProps {
    formId: string
    formKey: string
    categories: Category[]
    isCategoryLoading?: boolean
    selectedData: Transaction
    onSubmit: (values: TransactionFormValues) => void
}

export default function TransactionFormCard({ formId, formKey, categories, isCategoryLoading, selectedData, onSubmit }: TransactionFormCardProps) {
    return (
        <DrawerCard>
            <Stack spacing={2}>
                <Typography fontWeight={600}>Update transaction</Typography>
                <TransactionForm
                    key={formKey}
                    formId={formId}
                    defaultValues={{
                        amount: selectedData.amount,
                        date: selectedData.date ? new Date(selectedData.date) : null,
                        type: selectedData.type,
                        categoryId: selectedData.category?.id ?? '',
                    }}
                    categories={categories}
                    isCategoryLoading={isCategoryLoading}
                    onSubmit={onSubmit}
                />
            </Stack>
        </DrawerCard>
    )
}
