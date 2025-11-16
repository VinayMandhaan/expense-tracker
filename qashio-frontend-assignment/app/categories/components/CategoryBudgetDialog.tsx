import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'
import PrimaryActionButton from '@/app/components/PrimaryActionButton'
import BudgetDialogContent from './BudgetDialogContent'
import { BudgetFormValues } from './BudgetForm'

interface CategoryBudgetDialogProps {
  open: boolean
  success: boolean
  isSaving: boolean
  errorMessage: string | null
  onClose: () => void
  onSubmit: (values: BudgetFormValues) => void
}

export default function CategoryBudgetDialog({ open, success, isSaving, errorMessage, onClose, onSubmit }: CategoryBudgetDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{success ? 'Budget Added' : 'Add a Budget'}</DialogTitle>
      <DialogContent dividers>
        <BudgetDialogContent
          showForm={!success}
          success={success}
          errorMessage={errorMessage}
          isSaving={isSaving}
          onSubmit={onSubmit}
          formId="category-budget-form"
          successDescription="Budget updates will be updated"
        />
      </DialogContent>
      <DialogActions>
        {success ? (
          <PrimaryActionButton onClick={onClose}>Done</PrimaryActionButton>
        ) : (
          <>
            <Button onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <PrimaryActionButton type="submit" form="category-budget-form" disabled={isSaving}>
              {isSaving ? 'Saving' : 'Save Budget'}
            </PrimaryActionButton>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
