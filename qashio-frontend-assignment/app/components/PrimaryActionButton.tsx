'use client';

import Button, { ButtonProps } from '@mui/material/Button';

type PrimaryActionButtonProps = ButtonProps;

export default function PrimaryActionButton({
  children,
  sx,
  ...props
}: PrimaryActionButtonProps) {
  return (
    <Button
      variant="outlined"
      {...props}
      sx={{
        textTransform: 'none',
        borderColor: '#1f1f1f',
        color: '#1f1f1f',
        fontWeight: 600,
        borderRadius: '8px',
        px: 2.5,
        py: 1,
        '&:hover': { borderColor: '#000', bgcolor: '#f6f6f6' },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}
