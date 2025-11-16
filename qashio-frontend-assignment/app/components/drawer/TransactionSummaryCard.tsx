import { Chip, Stack, Typography } from '@mui/material'
import DrawerCard from './DrawerCard'
import { formatCurrency } from '@/lib/utils'
import { Transaction } from '@/app/transactions/types'

interface TransactionSummaryCardProps {
    amount: number
    categoryName: string
    date: string
    type: Transaction['type']
    typeLabel: string
}

export default function TransactionSummaryCard({ amount, categoryName, date, type, typeLabel }: TransactionSummaryCardProps) {
    return (
        <DrawerCard sx={{ pt: 4, pb: 4 }}>
            <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                            Current Amount
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {formatCurrency(amount)}
                        </Typography>
                    </Stack>
                    <Chip
                        label={typeLabel}
                        color={type === 'expense' ? 'error' : 'success'}
                        variant="filled"
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                </Stack>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center">
                    <Chip label={categoryName} size="small" variant="outlined" sx={{ borderRadius: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                        {date}
                    </Typography>
                </Stack>
            </Stack>
        </DrawerCard>
    )
}
