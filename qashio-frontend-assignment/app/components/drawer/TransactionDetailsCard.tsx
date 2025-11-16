import { Box, Stack, Typography } from '@mui/material'
import DrawerCard from './DrawerCard'

type DetailItem = {
    label: string
    value: React.ReactNode
}

const DetailItemRow = ({ label, value }: DetailItem) => (
    <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>
        <Typography fontWeight={600}>{value}</Typography>
    </Stack>
)

export default function TransactionDetailsCard({ details }: { details: DetailItem[] }) {
    return (
        <DrawerCard>
            <Stack spacing={2}>
                <Typography fontWeight={600}>Details</Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gap: 2,
                    }}
                >
                    {details.map((item) => (
                        <DetailItemRow key={item.label} {...item} />
                    ))}
                </Box>
            </Stack>
        </DrawerCard>
    )
}
