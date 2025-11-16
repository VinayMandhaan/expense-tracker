import { Stack, Typography } from '@mui/material'

export default function DrawerEmptyState() {
    return (
        <Stack spacing={1} alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <Typography fontWeight={600}>No transaction selected</Typography>
            <Typography color="text.secondary" variant="body2" align="center">
                Choose a transaction from the list to see full details.
            </Typography>
        </Stack>
    )
}
