import { Box } from "@mui/material";

export const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ p: 4 }}>
    {children}
  </Box>
)