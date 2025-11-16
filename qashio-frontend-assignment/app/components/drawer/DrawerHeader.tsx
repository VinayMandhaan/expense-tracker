import { Stack, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface DrawerHeaderProps {
    title: string
    onClose: () => void
}

export default function DrawerHeader({ title, onClose }: DrawerHeaderProps) {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: '#ececec' }}
        >
            <Stack spacing={0.5}>
                <Typography variant="overline" color="text.secondary" letterSpacing={1}>
                    Transaction
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                    {title}
                </Typography>
            </Stack>
            <IconButton onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </Stack>
    )
}
