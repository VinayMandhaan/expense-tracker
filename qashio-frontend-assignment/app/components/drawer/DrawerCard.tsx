import { Paper, PaperProps } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'

const baseCardSx: SxProps<Theme> = {
    borderRadius: 4,
    borderColor: '#ececec',
    p: 3,
    bgcolor: '#fff',
}

export default function DrawerCard({ children, sx, ...props }: PaperProps) {
    return (
        <Paper variant="outlined" sx={[baseCardSx, sx]} {...props}>
            {children}
        </Paper>
    )
}
