'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode, useState } from 'react';

// Create a custom theme
declare module '@mui/material/styles' {
  interface Palette {
    layout: {
      border: string;
      borderLight: string;
      borderDark: string;
    };
  }
  interface PaletteOptions {
    layout?: {
      border?: string;
      borderLight?: string;
      borderDark?: string;
    };
  }
}


const theme = createTheme({
  palette: {
    primary: {
      main: '#0063cc',
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#f8f9fa',
    },
    layout: {
      border: '#d0d0d0',
      borderLight: '#e0e0e0',
      borderDark: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
} 
