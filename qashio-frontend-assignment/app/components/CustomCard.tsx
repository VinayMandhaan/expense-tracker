import { Paper, Typography } from "@mui/material";

export const CustomCard = ({ label, value }: { label: string; value: string }) => (
    <Paper
        variant="outlined"
        sx={{ flex: 1, borderRadius: 3, borderColor: '#ececec', p: 3, minWidth: 220 }}
    >
        <Typography variant="body2" color="text.secondary" gutterBottom>
            {label}
        </Typography>
        <Typography variant="h5" fontWeight={600}>
            {value}
        </Typography>
    </Paper>
);