import { Dialog, DialogTitle, DialogContent, DialogActions, DialogProps } from '@mui/material'
import type { ReactNode } from 'react'

interface AppDialogProps extends Pick<DialogProps, 'open' | 'onClose' | 'maxWidth' | 'fullWidth'> {
  title?: ReactNode
  children: ReactNode
  actions?: ReactNode
  dividers?: boolean
}

export default function AppDialog({ title, children, actions, dividers = false, ...dialogProps }: AppDialogProps) {
  return (
    <Dialog {...dialogProps}>
      {title ? <DialogTitle>{title}</DialogTitle> : null}
      <DialogContent dividers={dividers}>{children}</DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  )
}
