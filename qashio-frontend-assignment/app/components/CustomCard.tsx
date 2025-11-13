import { Paper, Typography } from "@mui/material";

export const CustomCard = ({ label, value, subtTitle }: { label: string; value: string, subtTitle?: string }) => (
    <Paper
        variant="outlined"
        sx={{ flex: 1, borderRadius: 4, borderColor: '#ececec', p: 3, minWidth: 220 }}
    >
        <Typography variant="body2" color="text.secondary" gutterBottom>
            {label}
        </Typography>
        <Typography variant="h5" fontWeight={600}>
            {value}
        </Typography>
        {subtTitle && (
            <Typography variant="caption" color="text.secondary">
                {subtTitle}
            </Typography>
        )}
    </Paper>
);